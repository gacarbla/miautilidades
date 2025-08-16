/** GENERAL */
import MiauCommandResponse from "./commandResponse"

/** SLASH */
import MiauSlashCommandBuilder from "./slashBuilder"
import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder"
import MiauSlashSubcommandgroupBuilder from "./slashSubcommandgroupBuilder"

/** MESSAGE */
import MiauMessageCommandBuilder from "./messageBuilder"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"
import MiauMessageSubcommandgroupBuilder from "./messageSubcommandgroupBuilder"

export const commandInteractioners = {
    CommandResponse: MiauCommandResponse,
    SlashCommandBuilder: MiauSlashCommandBuilder,
    SlashSubcommandBuilder: MiauSlashSubcommandBuilder,
    SlashSubcommandgroupBuilder: MiauSlashSubcommandgroupBuilder,
    MessageCommandBuilder: MiauMessageCommandBuilder,
    MessageSubcommandBuilder: MiauMessageSubcommandBuilder,
    MessageSubcommandgroupBuilder: MiauMessageSubcommandgroupBuilder,
}

export {
    MiauCommandResponse,
    MiauSlashCommandBuilder,
    MiauSlashSubcommandBuilder,
    MiauSlashSubcommandgroupBuilder,
    MiauMessageCommandBuilder,
    MiauMessageSubcommandBuilder,
    MiauMessageSubcommandgroupBuilder,
}

export default commandInteractioners