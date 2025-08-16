import { ButtonBuilder, Client, ClientOptions, Message, OmitPartialGroupDMChannel } from "discord.js";
import Collection from "./collection";
import path from "path";
import { pathToFileURL } from 'url';
import fs from "fs/promises";
import { MiauButton, MiauChannelSelect, MiauContextMenu, MiauMessageCommand, MiauRoleSelect, MiauSlashCommand, MiauStringSelect, MiauUserSelect } from "./interactions";
import Utils from "../utils";
import MiauModal from "./interactioners/modal";
import MiauAutocomplete from "./interactioners/autocomplete";
import settings from "../../settings";
import { MiauClientEventsObject, MiauClientOptions } from "../interfaces/client";
import { deployCommands } from "../../deploy";
import { MiauButtonBuildData } from "../interfaces/button";

class MiauClient extends Client {
    private params: MiauClientOptions
    public utils: Utils = new Utils()
    constructor(djs_params: ClientOptions, mjs_params: MiauClientOptions) {
        super(djs_params)
        this.utils.console.log([], "MiauClient iniciado")
        this.params = mjs_params
    }

    events: MiauClientEventsObject = {}

    interactions = {
        getDeployJSON: () => {
            const sc = this.interactions.slashCommands.getAll().map(c => c.value.toJSON())
            const mc = this.interactions.contextMenus.getAll().map(c => c.value.toJSON())
            //const ac = this.interactions.autocompletes.getAll().map(c => c.value.toJSON())
            return [...mc, ...sc/*, ...ac*/]
        },
        message: new Collection<MiauMessageCommand>(),
        slashCommands: new Collection<MiauSlashCommand>(),
        contextMenus: new Collection<MiauContextMenu>(),
        buttons: new Collection<MiauButton>(),
        modals: new Collection<MiauModal>(),
        stringSelects: new Collection<MiauStringSelect>(),
        roleSelects: new Collection<MiauRoleSelect>(),
        channelSelects: new Collection<MiauChannelSelect>(),
        userSelects: new Collection<MiauUserSelect>(),
        autocompletes: new Collection<MiauAutocomplete>()
    }

    async build(token: string): Promise<void> {
        await this.load()
        this.utils.console.success([], "Configuración de MiauClient exitosa")
        this.login(token)
    }

    async forceMsgCommand(cmd: string, message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        const comando = this.interactions.message.get(cmd)
        if (!comando) throw new Error("El comando indicado no existe: " + cmd)
        await comando.execute(message)
    }

    load = async (): Promise<void> => {
        if (settings.refreshInteractions) {
            this.refreshInteractions();
        }

        // ⬇️ Carga de eventos
        try {
            await this.loadEvents();
            this.utils.console.success(["interactionBuildLog"], "Eventos cargados correctamente");
        } catch (err) {
            this.utils.console.error(["interactionBuildError"], "Error cargando eventos: " + err);
        }

        // ... el resto de tus listeners
        this.on("ready", () => {
            this.utils.console.success(["startLog"], `Cliente iniciado como ${this.user?.tag}`);
        });

        this.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand()) {
                this.utils.console.log(["commandExecutionLog"], "Nueva ejecución de comando: /" + interaction.commandName)
                const command = this.interactions.slashCommands.get(interaction.commandName);
                if (command) await command.execute(interaction);
            }
            if (interaction.isButton()) {
                const button = this.interactions.buttons.get(interaction.customId);
                this.utils.console.log(["buttonExecutionLog"], `Nueva ejecución de botón: ${button?.data.name ?? "?"} (${interaction.customId})`)
                if (button) await button.execute(interaction)
            }
        });

        this.on("messageCreate", async (msg) => {
            this.events.messages?.created?.forEach(e => e.execute(msg));

            if (!msg.content || msg.author?.bot) return;

            const content = msg.content;
            let usedPrefix: string | undefined;
            if (this.params.replyToMention && this.user) {
                const mentionRe = new RegExp(`^<@!?${this.user.id}>\\s*`);
                const m = content.match(mentionRe);
                if (m) usedPrefix = m[0];
            }

            if (!usedPrefix && this.params.regExpPrefix) {
                const m = content.match(this.params.regExpPrefix);
                if (m && m.index === 0) usedPrefix = m[0];
            }

            if (!usedPrefix && content.startsWith(this.params.defaultPrefix)) {
                usedPrefix = this.params.defaultPrefix;
            }

            if (!usedPrefix) return;

            const body = content.slice(usedPrefix.length).trim();
            if (!body) return;

            const [rawName] = body.split(/\s+/);
            if (!rawName) return;

            const nameLower = rawName.toLowerCase();
            const command =
                this.interactions.message.get(rawName) ??
                this.interactions.message.get(nameLower);

            if (!command) return;

            this.utils.console.log(["commandExecutionLog"], `Nueva ejecución de msg-cmd: ${rawName}`);

            try {
                await command.execute(msg as OmitPartialGroupDMChannel<Message<boolean>>);
            } catch (err) {
                const errorId =
                    this.utils.errorUtils?.newErrorId?.() ?? `E-${Date.now().toString(36)}`;
                const payload = this.utils.errorUtils?.redact
                    ? this.utils.errorUtils.redact(this.utils.errorUtils.serializeError(err))
                    : err;

                this.utils.console.error(["commandExecutionError"], `[$${rawName}] Error de ejecución`, payload);

                try {
                    await msg.reply(`❌ Ha ocurrido un error al ejecutar \`$${rawName}\`. (ID: ${errorId})`);
                } catch { }
            }
        });

        this.on("messageDelete", msg => {
            this.events.messages?.deleted?.forEach(e => e.execute(msg));
        });

        this.on("messageUpdate", (oldMsg, newMsg) => {
            this.events.messages?.edited?.forEach(e => e.execute(oldMsg, newMsg));
        });

        this.on("guildCreate", guild => {
            this.events.bot?.join?.forEach(e => e.execute(guild));
        });

        this.on("guildDelete", guild => {
            this.events.bot?.leave?.forEach(e => e.execute(guild));
        });

        this.on("guildBanAdd", ban => {
            this.events.users?.guildBan?.banned?.forEach(e => e.execute(ban));
        });

        this.on("guildBanRemove", ban => {
            this.events.users?.guildBan?.unbanned?.forEach(e => e.execute(ban));
        });

        this.on("guildMemberAdd", member => {
            this.events.users?.member?.join?.forEach(e => e.execute(member));
        });

        this.on("guildMemberRemove", member => {
            this.events.users?.member?.leave?.forEach(e => e.execute(member));
        });

        this.on("autoModerationActionExecution", (execution) => {
            this.events.guild?.discordAutomod?.messageBlocked?.forEach(e => e.execute(execution));
        });

        this.on("voiceStateUpdate", (oldState, newState) => {
            const member = newState.member ?? oldState.member;
            if (!member) return;

            const o = oldState;
            const n = newState;

            if (!o.channel && n.channel) this.events.users?.voice?.join?.forEach(e => e.execute(member, n.channel));
            if (o.channel && !n.channel) this.events.users?.voice?.leave?.forEach(e => e.execute(member, o.channel));
            if (o.channel && n.channel && o.channel.id !== n.channel.id) {
                this.events.users?.voice?.move?.forEach(e => e.execute(member, o.channel, n.channel));
                this.events.users?.voice?.moved?.forEach(e => e.execute(member, o.channel, n.channel));
            }
            if (o.deaf !== n.deaf) {
                const type = n.deaf ? "deafened" : "undeafened";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.mute !== n.mute) {
                const type = n.mute ? "muted" : "unmuted";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.serverDeaf !== n.serverDeaf) {
                const type = n.serverDeaf ? "serverDeafened" : "serverUndeafened";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.serverMute !== n.serverMute) {
                const type = n.serverMute ? "serverMuted" : "serverUnmuted";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.selfVideo !== n.selfVideo) {
                const type = n.selfVideo ? "startVideo" : "endVideo";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.streaming !== n.streaming) {
                const type = n.streaming ? "startStreaming" : "endStreaming";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
        });
    }

    private isMiauEvent(obj: any): boolean {
        return !!obj && typeof obj === "object" && typeof obj.execute === "function";
    }

    private extractRoutesFromEvent(ev: any): string[] {
        // Preferimos métodos explícitos si existen
        if (typeof ev.getRoutes === "function") {
            const r = ev.getRoutes();
            if (Array.isArray(r)) return r.filter((x) => typeof x === "string");
            if (typeof r === "string") return [r];
        }
        if (typeof ev.getTargets === "function") {
            const r = ev.getTargets();
            if (Array.isArray(r)) return r.filter((x) => typeof x === "string");
            if (typeof r === "string") return [r];
        }
        if (typeof ev.getExecutionMap === "function") {
            const m = ev.getExecutionMap();
            if (m && typeof m === "object") return Object.keys(m);
        }

        // Busca propiedades típicas que pueda haber guardado setExecution
        const candidates: string[] = [];
        const re = /^(bot|guild|users|messages)(\.[A-Za-z][A-Za-z0-9]*)*$/;

        const scan = (val: any) => {
            if (typeof val === "string" && re.test(val)) candidates.push(val);
            else if (Array.isArray(val)) val.forEach(scan);
            else if (val && typeof val === "object") {
                for (const v of Object.values(val)) scan(v);
            }
        };

        for (const key of Object.getOwnPropertyNames(ev)) {
            try { scan((ev as any)[key]); } catch { }
        }

        // Eliminar duplicados
        return [...new Set(candidates)];
    }

    private pushEventAtDotPath(dotPath: string, handler: any): void {
        const parts = dotPath.split(".").filter(Boolean); // e.g. ["messages","edited"]
        if (!parts.length) return;

        let cursor: any = this.events;
        for (let i = 0; i < parts.length - 1; i++) {
            const k = parts[i]!;
            if (!cursor[k] || typeof cursor[k] !== "object") cursor[k] = {};
            cursor = cursor[k];
        }
        const leaf = parts[parts.length - 1]!;
        if (!Array.isArray(cursor[leaf])) cursor[leaf] = [];
        cursor[leaf].push(handler);
    }

    private async loadEvents(): Promise<void> {
        const basePath = path.resolve(this.params.eventsFolder);

        const importFile = async (filePath: string) => {
            const fileUrl = pathToFileURL(filePath).href;
            const mod = await import(fileUrl);
            // Acepta default y nombrados, y también objetos con default dentro
            return Object.values(mod).flatMap((v) =>
                typeof v === "object" && v !== null && "default" in (v as any)
                    ? Object.values(v as any)
                    : [v]
            );
        };

        const loadDir = async (dir: string): Promise<void> => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    await loadDir(fullPath);
                    continue;
                }

                if (
                    !entry.name.match(/\.(js|ts)$/) ||
                    entry.name.endsWith(".d.ts") ||
                    entry.name.endsWith(".d.js")
                ) continue;

                try {
                    const exported = await importFile(fullPath);
                    for (const ex of exported) {
                        const candidates = (ex && typeof ex === "object" && "default" in (ex as any))
                            ? [(ex as any).default]
                            : [ex];

                        for (const inst of candidates) {
                            if (!this.isMiauEvent(inst)) continue;

                            const routes = this.extractRoutesFromEvent(inst);
                            if (routes.length) {
                                for (const r of routes) {
                                    this.pushEventAtDotPath(r, inst);
                                    this.utils.console.info(["interactionBuildLog"], `+ Evento (ruta): ${r}`);
                                }
                                continue;
                            }

                            const rel = path.relative(basePath, fullPath).replace(/\\/g, "/");
                            const noext = rel.replace(/\.(js|ts)$/, "");
                            const segs = noext.split("/").filter(Boolean); // e.g. ["messages","edited"]

                            if (segs.length >= 2) {
                                const dot = segs.join(".");
                                this.pushEventAtDotPath(dot, inst);
                                this.utils.console.info(["interactionBuildLog"], `+ Evento (fs): ${dot}`);
                            } else {
                                this.utils.console.warning(["interactionBuildWarn"], `Evento ignorado (no se pudo deducir ruta): ${fullPath}`);
                            }
                        }
                    }
                } catch (err) {
                    this.utils.console.error(["interactionBuildError"], `Error al importar evento ${fullPath}: ` + err);
                }
            }
        };

        await loadDir(basePath);
    }


    refreshInteractions = async (): Promise<void> => {
        const basePath = path.resolve(this.params.interactionsFolder);

        const loadFiles = async (dir: string): Promise<void> => {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    await loadFiles(fullPath);
                    continue;
                }

                if (!entry.name.match(/\.(js|ts)$/) || entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.js"))
                    continue;

                try {
                    const fileUrl = pathToFileURL(fullPath).href;
                    const imported = await import(fileUrl);

                    const exportList = Object.values(imported).flatMap(v =>
                        typeof v === "object" && v !== null && "default" in v
                            ? Object.values(v)
                            : [v]
                    );

                    for (const instance of exportList) {
                        if (!(instance instanceof Object)) continue;

                        if (instance instanceof MiauMessageCommand) {
                            this.interactions.message.add(instance, instance.data.name);
                            this.utils.console.info(["interactionBuildLog"], `+ Comando: $${instance.data.name}`)
                        } else if (instance instanceof MiauSlashCommand) {
                            this.interactions.slashCommands.add(instance, instance.data.name);
                            this.utils.console.info(["interactionBuildLog"], `+ Comando: /${instance.data.name}`)
                        } else if (instance instanceof MiauContextMenu) {
                            this.interactions.contextMenus.add(instance, instance.data.name);
                            this.utils.console.info(["interactionBuildLog"], `+ Menú contextual: ${instance.data.name}`)
                        } else if (instance instanceof MiauButton) {
                            this.interactions.buttons.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ Botón: ${instance.data.customId}`)
                        } else if (instance instanceof MiauModal) {
                            this.interactions.modals.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ Modal: ${instance.data.customId}`)
                        } else if (instance instanceof MiauStringSelect) {
                            this.interactions.stringSelects.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ String Select: ${instance.data.customId}`)
                        } else if (instance instanceof MiauRoleSelect) {
                            this.interactions.roleSelects.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ Role Select: ${instance.data.customId}`)
                        } else if (instance instanceof MiauChannelSelect) {
                            this.interactions.channelSelects.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ Channel Select: ${instance.data.customId}`)
                        } else if (instance instanceof MiauUserSelect) {
                            this.interactions.userSelects.add(instance, instance.data.customId);
                            this.utils.console.info(["interactionBuildLog"], `+ User Select: ${instance.data.customId}`)
                        } else if (instance instanceof MiauAutocomplete) {
                            this.interactions.autocompletes.add(instance, instance.data.command);
                            this.utils.console.info(["interactionBuildLog"], `+ Autocomplete: ${instance.data.command}`)
                        }
                    }
                } catch (err) {
                    this.utils.console.error(["interactionBuildError"], `Error al importar ${fullPath}:` + err);
                }
            }
        };

        try {
            await loadFiles(basePath);
            await deployCommands(this);
            this.utils.console.success(["interactionBuildLog"], "Interacciones cargadas desde " + basePath);
        } catch (err) {
            this.utils.console.error(["interactionBuildError"], "Error cargando interacciones: " + err);
        }
    };

    interactionBuild = {
        button: (name: string): ((data?: MiauButtonBuildData) => ButtonBuilder) | undefined => {
            let button = this.interactions.buttons.get(name)
            if (typeof button == "undefined") throw new Error("Interacción no reconocida")
            try {
                return button.build
            } catch (e) {
                throw new Error("Error montando el comando: " + e)
            }
        }
    }

}

export default MiauClient