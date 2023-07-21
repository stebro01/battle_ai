import PACKAGE from '../../package.json'

export default function () {
  return {
    APP_TITLE: PACKAGE.productName,
    APP_VERSION: PACKAGE.version,
    folder: undefined,
    RESULTS: []
  }
}
