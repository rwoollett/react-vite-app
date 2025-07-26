import { createAction } from '@reduxjs/toolkit';
import { type CountdownTimer } from '../../types/countdown';

export const setContents = createAction<string[]>('data/setContents')

export const addCountdown = createAction<CountdownTimer>('data/addCountdown')
export const removeCountdown = createAction<CountdownTimer>('data/removeCountdown')
