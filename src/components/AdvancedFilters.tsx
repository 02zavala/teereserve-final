'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Filter, X, Star, MapPin, DollarSign, Calendar, 
  Users, Clock, Bookmark, RotateCcw, Search,
  ChevronDown, ChevronUp, Settings
} from 'lucide-react'

interface FilterState {
  location: string
  priceRange: [number, number]
  holes: string[]
  rating: number
  features: string[]
  availability: string
  sortBy: string
  searchTerm: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  savedFilters?: FilterState[]
  onSaveFilter?: (name: string, filters: FilterState) => void
}

const locations = [
  { value: 'all', label: 'Todas las ubicaciones' },
  { value: 'los-cabos', label: 'Los Cabos, BCS' },
  { value: 'cancun', label: 'Cancún, Q.R.' },
  { value: 'puerto-vallarta', label: 'Puerto Vallarta, Jal.' },
  { value: 'playa-del-carmen', label: 'Playa del Carmen, Q.R.' },
  { value: 'mazatlan', label: 'Mazatlán, Sin.' }
]

const holeOptions = [
  { value: '9', label: '9 hoyos' },
  { value: '18', label: '18 hoyos' },
  { value: '27', label: '27 hoyos' },
  { value: '36', label: '36 hoyos' }
]

const courseFeatures = [
  { value: 'ocean-view', label: 'Vista al océano' },
  { value: 'desert', label: 'Campo desértico' },
  { value: 'mountain', label: 'Vista a montañas' },
  { value: 'championship', label: 'Campo de campeonato' },
  { value: 'resort', label: 'Campo de resort' },
  { value: 'public', label: 'Campo público' },
  { value: 'private', label: 'Campo privado' },
  { value: 'driving-range', label: 'Campo de práctica' },
  { value: 'pro-shop', label: 'Tienda profesional' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'spa', label: 'Spa' },
  { value: 'hotel', label: 'Hotel' }
]

const sortOptions = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price-low', label: 'Precio: menor a mayor' },
  { value: 'price-high', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'distance', label: 'Más cercanos' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'popular', label: 'Más populares' }
]

export default function AdvancedFilters({ 
  onFiltersChange, 
  savedFilters = [], 
  onSaveFilter 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    priceRange: [100, 500],
    holes: [],
    rating: 0,
    features: [],
    availability: 'all',
    sortBy: 'relevance',
    searchTerm: ''
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState('')

  // Contar filtros activos
  useEffect(() => {
    let count = 0
    if (filters.location !== 'all') count++
    if (filters.priceRange[0] !== 100 || filters.priceRange[1] !== 500) count++
    if (filters.holes.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.features.length > 0) count++
    if (filters.availability !== 'all') count++
    if (filters.searchTerm.length > 0) count++
    
    setActiveFiltersCount(count)
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      location: 'all',
      priceRange: [100, 500],
      holes: [],
      rating: 0,
      features: [],
      availability: 'all',
      sortBy: 'relevance',
      searchTerm: ''
    })
  }

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const toggleHoles = (holes: string) => {
    setFilters(prev => ({
      ...prev,
      holes: prev.holes.includes(holes)
        ? prev.holes.filter(h => h !== holes)
        : [...prev.holes, holes]
    }))
  }

  const saveCurrentFilter = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter(filterName.trim(), filters)
      setFilterName('')
      setShowSaveDialog(false)
    }
  }

  const loadSavedFilter = (savedFilter: FilterState) => {
    setFilters(savedFilter)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Avanzados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Búsqueda y Ordenamiento - Siempre visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Buscar campos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="search"
                placeholder="Nombre del campo, ubicación..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sortBy">Ordenar por</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Ubicación y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" />
                  Ubicación
                </Label>
                <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Rango de Precio (USD)
                </Label>
                <div className="space-y-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value)}
                    max={1000}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Número de Hoyos y Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  Número de Hoyos
                </Label>
                <div className="flex flex-wrap gap-2">
                  {holeOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={filters.holes.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleHoles(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" />
                  Calificación Mínima
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Button
                      key={rating}
                      variant={filters.rating >= rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('rating', rating === filters.rating ? 0 : rating)}
                      className="p-2"
                    >
                      <Star className={`w-4 h-4 ${filters.rating >= rating ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                  {filters.rating > 0 && (
                    <span className="text-sm text-slate-600 ml-2">
                      {filters.rating}+ estrellas
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Disponibilidad */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" />
                Disponibilidad
              </Label>
              <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier momento</SelectItem>
                  <SelectItem value="today">Disponible hoy</SelectItem>
                  <SelectItem value="tomorrow">Disponible mañana</SelectItem>
                  <SelectItem value="weekend">Fin de semana</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Características del Campo */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4" />
                Características del Campo
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {courseFeatures.map(feature => (
                  <div key={feature.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.value}
                      checked={filters.features.includes(feature.value)}
                      onCheckedChange={() => toggleFeature(feature.value)}
                    />
                    <Label 
                      htmlFor={feature.value} 
                      className="text-sm cursor-pointer"
                    >
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Filtros Guardados y Acciones */}
            <div className="space-y-4">
              {savedFilters.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Bookmark className="w-4 h-4" />
                    Filtros Guardados
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {savedFilters.map((savedFilter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSavedFilter(savedFilter)}
                        className="text-xs"
                      >
                        Filtro {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guardar Filtro Actual */}
              {activeFiltersCount > 0 && onSaveFilter && (
                <div>
                  {!showSaveDialog ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSaveDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4" />
                      Guardar Filtros Actuales
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nombre del filtro"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="w-48"
                      />
                      <Button size="sm" onClick={saveCurrentFilter}>
                        Guardar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowSaveDialog(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filtros Activos - Resumen */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Filtros Activos:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.location !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locations.find(l => l.value === filters.location)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('location', 'all')}
                  />
                </Badge>
              )}
              
              {(filters.priceRange[0] !== 100 || filters.priceRange[1] !== 500) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('priceRange', [100, 500])}
                  />
                </Badge>
              )}
              
              {filters.rating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {filters.rating}+ estrellas
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('rating', 0)}
                  />
                </Badge>
              )}
              
              {filters.holes.map(hole => (
                <Badge key={hole} variant="secondary" className="flex items-center gap-1">
                  {hole} hoyos
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleHoles(hole)}
                  />
                </Badge>
              ))}
              
              {filters.features.map(feature => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {courseFeatures.find(f => f.value === feature)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

