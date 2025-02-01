import { ButtonStyle } from "discord.js";
import { MiauButton } from "./interactions";

export default new MiauButton({
    customId: 'Test',
    isRestricted: false,
    label: 'Ejemplo',
    name: 'Botón de ejemplo',
    style: ButtonStyle.Primary,
})