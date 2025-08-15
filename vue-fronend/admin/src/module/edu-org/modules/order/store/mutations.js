export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    statuses: data.statuses,
    appStatuses: data.appStatuses,

    epguDocCategories: data.epguDocCategories,
    epguDocTypes: data.epguDocTypes,
    eduTypes: data.eduTypes,
  })
}


