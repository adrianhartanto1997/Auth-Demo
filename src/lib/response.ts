import { NextResponse } from 'next/server'

export interface ErrorResponse {
  statusCode: number
  payload: any
}

export const dataKey = 'data'
export const errorKey = 'error'

export const NewInternalServerErrorResponse = (error: Error): ErrorResponse => {
  console.log(error)

  const response: ErrorResponse = {
    statusCode: 500,
    payload: 'Something went wrong.',
  }
  return response
}

export const renderAPISuccessResponse = (data: any): NextResponse => {
  return NextResponse.json({ [dataKey]: data })
}

export const renderAPIErrorResponse = (error: ErrorResponse): NextResponse => {
  return NextResponse.json(
    { [errorKey]: error.payload },
    { status: error.statusCode }
  )
}

export const ApiExceptionHandler = (error: Error): NextResponse => {
  const defaultSyntaxErrorResponseMessage = 'Request error. Must be valid JSON.'

  if (error instanceof SyntaxError) {
    return renderAPIErrorResponse({
      statusCode: 400,
      payload: defaultSyntaxErrorResponseMessage,
    })
  }

  const errResp = NewInternalServerErrorResponse(error)
  return renderAPIErrorResponse(errResp)
}
