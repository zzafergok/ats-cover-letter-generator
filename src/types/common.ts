export interface ComponentItem {
  id: string
  name: string
  category: string
  popularity: number
  description: string
  lastUpdated: string
  tags: string[] // required field
  component?: React.ComponentType<unknown>
  status: 'stable' | 'beta' | 'alpha' | 'deprecated'
}
