import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src', // define api folder under app folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Auth Demo API Docs',
        version: '1.0',
      },
      components: {
        schemas: {
          UserProfile: {
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              email: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              hasVerifiedEmail: {
                type: 'boolean',
                default: false
              },
              createdAt: {
                type: 'string',
                format: 'date-time'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time'
              }
            }
          }
        }
      },
      security: [],
    },
  })
  return spec
}
