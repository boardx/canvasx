import { createSlice } from '@reduxjs/toolkit';

export const rescoureSlice = createSlice({
  name: 'rescoure',
  initialState: {
    templateList: [],
    rescourePageImageList: [],
    rescourePageIconList: [],
    orgTemplateList: [],
    myTemplateList: [],
    offcialTemplateList: [],
    aiTemplateList: [],
    currentTemplate: null,
    currentPrompt: null,
    openTempalte: false,
    openPrompt: false,
    isAllTemplate: null,
    searchTemplateList: null,
    pTagList: null,
    selectedTag: null,
    templateDetail: false,
    promptDetail: false,
    muiTabsValue: '1',
    resourcePageStatusByTemplate: {
      templateSearchList: [],
      searchValue: '',
      submenuMuiTabsValue: '1',
    },
    resourcePageStatusByImage: {
      searchValue: 'ideas',
      imagesPage: 1,
    },
    resourcePageStatusByIcon: {
      searchValue: 'badge',
      iconsPage: 0,
    },
    //emoji
    currentHoverObjectId: null,
    //video
    videoUrl: null,
  },
  reducers: {
    handleSetTemplateList(state, action) {
      state.templateList = action.payload;
    },
    handleSetRescourePageImageList(state, action) {
      state.rescourePageImageList = action.payload;
    },
    handleSetRescourePageIconList(state, action) {
      state.rescourePageIconList = action.payload;
    },
    handleSetOrgTemplateList(state, action) {
      state.orgTemplateList = action.payload;
    },
    handleSetMyTemplateList(state, action) {
      state.myTemplateList = action.payload;
    },
    handleSetOffcialTemplateList(state, action) {
      state.offcialTemplateList = action.payload;
    },
    handleSetAiTemplateList(state, action) {
      state.aiTemplateList = action.payload;
    },
    handleSetCurrentTemplate(state, action) {
      state.currentTemplate = action.payload;
    },
    handleSetCurrentPrompt(state, action) {
      state.currentPrompt = action.payload;
    },
    handleSetOpenTemplate(state, action) {
      state.openTempalte = action.payload;
    },
    handleSetOpenPrompt(state, action) {
      state.openPrompt = action.payload;
    },
    handleSetIsAllTemplate(state, action) {
      state.isAllTemplate = action.payload;
    },
    handleSetSearchTemplateList(state, action) {
      state.searchTemplateList = action.payload;
    },
    handleSetPTagList(state, action) {
      state.pTagList = action.payload;
    },
    handleSetSelectedTag(state, action) {
      state.selectedTag = action.payload;
    },
    handleSetTemplateDetail(state, action) {
      state.templateDetail = action.payload;
    },
    handleSetPromptDetail(state, action) {
      state.promptDetail = action.payload;
    },
    handleSetCurrentHoverObjectId(state, action) {
      state.currentHoverObjectId = action.payload;
    },
    handleSetVideoUrl(state, action) {
      state.videoUrl = action.payload;
    },
    handleSetMuiTabsValue(state, action) {
      state.muiTabsValue = action.payload;
    },
    handleSetResourcePageStatusByTemplate(state, action) {
      state.resourcePageStatusByTemplate.templateSearchList =
        action.payload.templateSearchList;
      state.resourcePageStatusByTemplate.searchValue =
        action.payload.searchValue;
      state.resourcePageStatusByTemplate.submenuMuiTabsValue =
        action.payload.submenuMuiTabsValue;
    },
    handleSetResourcePageStatusByImage(state, action) {
      state.resourcePageStatusByImage.searchValue = action.payload.searchValue;
      state.resourcePageStatusByImage.imagesPage = action.payload.imagesPage;
    },
    handleSetResourcePageStatusByIcon(state, action) {
      state.resourcePageStatusByIcon.searchValue = action.payload.searchValue;
      state.resourcePageStatusByIcon.iconsPage = action.payload.iconsPage;
    },
  },
});

export const {
  handleSetTemplateList,
  handleSetOrgTemplateList,
  handleSetMyTemplateList,
  handleSetOffcialTemplateList,
  handleSetAiTemplateList,
  handleSetCurrentTemplate,
  handleSetCurrentPrompt,
  handleSetOpenTemplate,
  handleSetOpenPrompt,
  handleSetIsAllTemplate,
  handleSetSearchTemplateList,
  handleSetPTagList,
  handleSetSelectedTag,
  handleSetTemplateDetail,
  handleSetPromptDetail,
  handleSetCurrentHoverObjectId,
  handleSetVideoUrl,
  handleSetRescourePageImageList,
  handleSetRescourePageIconList,
  handleSetMuiTabsValue,
  handleSetResourcePageStatusByTemplate,
  handleSetResourcePageStatusByImage,
  handleSetResourcePageStatusByIcon,
} = rescoureSlice.actions;
export default rescoureSlice.reducer;
