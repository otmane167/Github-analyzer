import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/github'

export interface AnalysisResponse {
  username: string
  name: string
  avatarUrl: string
  followers: number
  publicRepos: number
  languages: Record<string, number>
  score: number
  level: string
}

export interface RepoResponse {
  name: string
  language: string | null
  stargazers_count: number
  forks_count: number
}

export interface AiRecommendation {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export class GithubApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export async function analyzeUser(username: string): Promise<AnalysisResponse> {
  try {
    const res = await axios.get<AnalysisResponse>(`${BASE_URL}/${username}/analyze`)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        throw new GithubApiError(`No GitHub user named "${username}"`, 404)
      }
      if (err.response) {
        throw new GithubApiError(`Backend error (${err.response.status}). Check the backend console.`)
      }
      throw new GithubApiError('Could not reach the analyzer backend. Is it running on :8080?')
    }
    throw new GithubApiError('Something unexpected happened')
  }
}

export async function fetchRepos(username: string): Promise<RepoResponse[]> {
  try {
    const res = await axios.get<RepoResponse[]>(`${BASE_URL}/${username}/repos`)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        throw new GithubApiError(`No GitHub user named "${username}"`, 404)
      }
      throw new GithubApiError('Could not reach the analyzer backend. Is it running on :8080?')
    }
    throw new GithubApiError('Something unexpected happened')
  }
}

export async function fetchRecommendations(username: string): Promise<AiRecommendation> {
  try {
    const res = await axios.get<AiRecommendation>(`${BASE_URL}/${username}/recommendations`)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 503) {
        throw new GithubApiError('AI recommendations are not configured on the backend.')
      }
      if (err.response) {
        throw new GithubApiError('The local AI model could not generate recommendations.')
      }
      throw new GithubApiError('Could not reach the analyzer backend.')
    }
    throw new GithubApiError('Something unexpected happened')
  }
}