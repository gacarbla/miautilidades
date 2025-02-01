import { ButtonStyle } from "discord.js";
import { MiauButton } from "./interactions";

const b = new MiauButton({
    customId: 'Test',
    isRestricted: false,
    label: 'Ejemplo',
    name: 'Botón de ejemplo',
    style: ButtonStyle.Primary,
})

console.log(b.build({}))