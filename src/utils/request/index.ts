import request from 'request'

export const post = async <T extends {}>(
  uri: string,
  data: Record<string, string> = {},
  headers: Record<string, string> = {},
): Promise<{ response: request.Response; body: T }> => {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-type': 'application/json',
      'User-Agent': 'node',
    }
    const options = {
      uri,
      headers: { ...defaultHeaders, ...headers },
      json: data,
    }

    request.post(options, (error, response, body) => {
      if (error) {
        return reject(error)
      }

      resolve({ response, body })
    })
  })
}

export const get = async <T extends {}>(
  uri: string,
  parameter: Record<string, string> = {},
  headers: Record<string, string> = {},
): Promise<{ response: request.Response; body: T }> => {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-type': 'application/json',
      'User-Agent': 'node',
    }
    const options = {
      uri,
      headers: { ...defaultHeaders, ...headers },
      parameter,
      json: true,
    }

    request.get(options, (error, response, body) => {
      if (error) {
        return reject(error)
      }

      resolve({ response, body })
    })
  })
}
