import { post } from '../request'

export const postSlackWebhook = async (
  url: string,
  message: string,
): Promise<void> => {
  await post(url, { text: message })
}
