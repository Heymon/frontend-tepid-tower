import {atom} from "recoil";

export const userState = atom({
    key: "userState",
    default: null,
});

export const gameState = atom({
    key: "gameState",
    default: true,
});

export const resetState = atom({
    key: "resetState",
    default: false,
});

export const userPoints = atom({
    key: "userPoints",
    default: 0,
});