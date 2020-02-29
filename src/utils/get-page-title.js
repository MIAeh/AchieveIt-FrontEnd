import defaultSettings from '@/settings'

const title = defaultSettings.title || 'AchieveIt-FrontEnd'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
