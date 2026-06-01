import { createAction } from '@reduxjs/toolkit';
import { type Game } from '../../types/ttt';

export const setCurrentGame = createAction<Game>("ttt/setCurrentGame");
export const clearCurrentGame = createAction("ttt/clearCurrentGame");
export const setCurrentGameUser = createAction<string>("ttt/setCurrentGameUser");
export const clearCurrentGameUser = createAction("ttt/clearCurrentGameUser");

