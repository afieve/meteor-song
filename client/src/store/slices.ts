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
    classColor: string | null;
}

const initialDetailedMeteoriteState: DetailedMeteoriteState = {
    meteorite: null,
    classColor: null
}

export const detailedMeteoriteSlice = createSlice({
    name: 'detailedMeteorite',
    initialState: initialDetailedMeteoriteState,
    reducers: {
        clearDetailedMeteorite: (state) => {
            state.meteorite = null;
            state.classColor = null
        },
        setDetailedMeteorite: (state, action: PayloadAction<DetailedMeteoriteState>) => {
            state.meteorite = action.payload.meteorite;
            state.classColor = action.payload.classColor;
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

// SPACE LOG
interface SpaceLogState {
    msg: string;
    loading: boolean;
}
const initialSpaceLogState: SpaceLogState = {
    msg: "Chargement initial des données...",
    loading: true
}

export const spaceLogSlice = createSlice({
    name: 'spaceLogState',
    initialState: initialSpaceLogState,
    reducers: {
        setSpaceLog: (state, action: PayloadAction<SpaceLogState>) => {
            // state = {msg: action.payload.msg, loading: action.payload.loading};
            state.msg = action.payload.msg
            state.loading = action.payload.loading;
        }
    }
});

// FILTERS INPUTS
interface FiltersInputsState {
    disabled: boolean;
}
const initialFiltersInputsState: FiltersInputsState = {
    disabled: true
}
export const filtersInputsSlice = createSlice({
    name: 'filtersInputsState',
    initialState: initialFiltersInputsState,
    reducers: {
        setFiltersInputsAreDisabled: (state, action: PayloadAction<boolean>) => {
            state.disabled = action.payload;
        }
    }
})

export const { toggleTheme, setTheme } = themeSlice.actions;
export const { clearDetailedMeteorite, setDetailedMeteorite } = detailedMeteoriteSlice.actions;
export const { openDetailsModal, closeDetailsModal, toggleOpenCloseDetailsModal } = meteoriteDetailsModalSlice.actions;
export const { setSpaceLog } = spaceLogSlice.actions;
export const {setFiltersInputsAreDisabled} = filtersInputsSlice.actions;

export const rootReducer = {
    theme: themeSlice.reducer,
    detailedMeteorite: detailedMeteoriteSlice.reducer,
    meteoriteDetailsModal: meteoriteDetailsModalSlice.reducer,
    spaceLog: spaceLogSlice.reducer,
    filtersInputsState: filtersInputsSlice.reducer
};