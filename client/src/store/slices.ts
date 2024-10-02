import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMeteoriteLandingGeoJSONDocument } from "../types/MeteoriteLanding";

// VISUAL THEME
interface ThemeState {
    currentTheme: 'light' | 'dark';
}

const initialThemeState: ThemeState = {
    currentTheme: 'dark'
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState: initialThemeState,
    reducers: {
        toggleTheme: (state) => {
            state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.currentTheme = action.payload;
        }
    }
});

// DETAILED METEORITE
interface DetailedMeteoriteState {
    meteorite: IMeteoriteLandingGeoJSONDocument | null;
}

const initialDetailedMeteoriteState: DetailedMeteoriteState = {
    meteorite: null
}

export const detailedMeteoriteSlice = createSlice({
    name: 'detailedMeteorite',
    initialState: initialDetailedMeteoriteState,
    reducers: {
        clearDetailedMeteorite: (state) => {
            state.meteorite = null;
        },
        setDetailedMeteorite: (state, action: PayloadAction<IMeteoriteLandingGeoJSONDocument>) => {
            state.meteorite = action.payload;
        }
    }
});

// DETAILED METEORITE MODAL 
interface MeteoriteDetailsModalState {
    isOpen: boolean;
}

const initialMeteoriteDetailsModalState: MeteoriteDetailsModalState = {
    isOpen: false
}

export const meteoriteDetailsModalSlice = createSlice({
    name: 'detailedMeteoriteModal',
    initialState: initialMeteoriteDetailsModalState,
    reducers: {
        openDetailsModal: (state) => {
            state.isOpen = true;
        },
        closeDetailsModal: (state) => {
            state.isOpen = false;
        },
        toggleOpenCloseDetailsModal: (state) => {
            state.isOpen = state.isOpen ? false : true;
        } 
    }
});



export const { toggleTheme, setTheme } = themeSlice.actions;
export const { clearDetailedMeteorite, setDetailedMeteorite } = detailedMeteoriteSlice.actions;
export const { openDetailsModal, closeDetailsModal, toggleOpenCloseDetailsModal } = meteoriteDetailsModalSlice.actions;

export const rootReducer = {
    theme: themeSlice.reducer,
    detailedMeteorite: detailedMeteoriteSlice.reducer,
    meteoriteDetailsModal: meteoriteDetailsModalSlice.reducer
};