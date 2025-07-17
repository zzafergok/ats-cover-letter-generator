/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalAxiosRequestConfig } from 'axios'

export interface QueueItem {
  resolve: (config: InternalAxiosRequestConfig) => void
  reject: (error: any) => void
  config: InternalAxiosRequestConfig
}

export class RequestQueue {
  private static instance: RequestQueue
  private queue: QueueItem[] = []
  private isRefreshing = false

  static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue()
    }
    return RequestQueue.instance
  }

  addToQueue(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, config })
    })
  }

  processQueue(error: any, token: string | null): void {
    this.queue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error)
      } else if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
        resolve(config)
      }
    })
    this.queue = []
  }

  setRefreshing(status: boolean): void {
    this.isRefreshing = status
  }

  isRefreshingToken(): boolean {
    return this.isRefreshing
  }
}
