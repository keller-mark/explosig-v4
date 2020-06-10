import { combineReducers } from 'redux';
import { configSlice, datasetsSlice, scalesSlice } from './slices';

export default combineReducers({
  config: configSlice.reducer,
  datasets: datasetsSlice.reducer,
  scales: scalesSlice.reducer,
});
