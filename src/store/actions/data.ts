import { createAction } from '@reduxjs/toolkit';
import { type CountdownTimer } from '../../types/countdown';
import { type Game } from '../../types/ttt';

export const setContents = createAction<string[]>('data/setContents')

export const addCountdown = createAction<CountdownTimer>('data/addCountdown')
export const removeCountdown = createAction<CountdownTimer>('data/removeCountdown')

export const setCurrentGame = createAction<Game>("ttt/setCurrentGame");
export const clearCurrentGame = createAction("ttt/clearCurrentGame");
export const setCurrentGameUser = createAction<string>("ttt/setCurrentGameUser");
export const clearCurrentGameUser = createAction("ttt/clearCurrentGameUser");

