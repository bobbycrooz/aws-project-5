import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('todos')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Getting all todos for user', { userId })
  return todosAccess.getAllTodos(userId)
}

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const todoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    ...createTodoRequest
  }

  return todosAccess.createTodoItem(todoItem)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  return todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  return todosAccess.deleteTodoItem(todoId, userId)
}

export async function generateUploadUrl(
  todoId: string,
  userId: string
): Promise<string> {
  const url = attachmentUtils.getUploadUrl(todoId)

  await todosAccess.updateTodoAttachmentUrl(todoId, userId, url)

  return url
}

export async function updateTodoAttachmentUrl(
  todoId: string,
  userId: string,
  attachmentUrl: string
): Promise<void> {
  return todosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl)
}

export async function getTodo(
  todoId: string,
  userId: string
): Promise<TodoItem> {
  return todosAccess.getTodoItem(todoId, userId)
}

export async function generatePresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Generating upload url', { todoId })
  const todo = await todosAccess.getTodoItem(todoId, userId)
  if (!todo) {
    throw new createError.NotFound(`Todo with id ${todoId} not found`)
  } else if (todo.userId !== userId) {
    throw new createError.Unauthorized(
      `User ${userId} is not authorized to access todo ${todoId}`
    )
  } else if (todo.attachmentUrl) {
    throw new createError.BadRequest(`Todo ${todoId} already has an attachment`)
  } else {
    logger.info('Todo exists and has no attachment', { todoId })
  }

  return await attachmentUtils.getUploadUrl(todoId)
}

// import 'source-map-support/register'
//
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
