export {}

type PluginEnterPayload = {
  code?: string
  type?: string
  payload?: any
  option?: any
  inputState?: {
    searchQuery?: string
    pastedImage?: any
    pastedFiles?: any
    pastedText?: string | null
  }
}

type PluginDbStorage = {
  setItem: (key: string, value: any) => any
  getItem: (key: string) => any
  removeItem?: (key: string) => any
}

type PluginRuntimeBridge = {
  getPlatform: () => string
  isUTools: () => boolean
  isZTools: () => boolean
  getApi: () => any
  dbStorage: PluginDbStorage
  showNotification: (message: string) => any
  shellOpenExternal: (url: string) => any
  copyText: (text: string) => any
  hideMainWindow: () => any
  hideMainWindowTypeString: (text: string) => any
  screenCapture: (callback: (image: string, bounds?: any) => void) => any
  onPluginEnter: (callback: (payload: PluginEnterPayload) => void) => any
  onPluginReady: (callback: (payload: PluginEnterPayload) => void) => any
  getEnterText: (payload: PluginEnterPayload) => string
  resolveEnterText: (payload: PluginEnterPayload) => Promise<string>
}

declare global {
  interface Window {
    ztools?: any
    utools?: any
    pluginRuntime?: PluginRuntimeBridge
    getPluginRuntime?: () => any
    getRuntimePlatform?: () => string
    oepnUrl?: (url: string) => Promise<void> | any
    openUrl?: (url: string) => Promise<void> | any
    saveConfig: (key: string, value: any) => any
    getConfig: (key: string) => any
    mcopy: (text: string) => any
    mcopyHide: (text: string) => any
    mcopyHideEnter: (text: string) => any
    captureAndTranslateImage: (
      targetLang: string,
      googleImageApiKey: string
    ) => Promise<any>
    loadSetting?: () => void
  }
}
