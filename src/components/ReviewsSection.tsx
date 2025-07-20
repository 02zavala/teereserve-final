'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Star, User, Calendar, ThumbsUp, Camera, 
  ChevronLeft, ChevronRight, Filter, SortAsc
} from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  images: string[]
  date: string
  helpfulVotes: number
  isVerified: boolean
  playedDate?: string
}

interface ReviewsSectionProps {
  courseId: string
  courseName: string
  averageRating: number
  totalReviews: number
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Carlos Mendoza',
    userAvatar: '/avatars/carlos.jpg',
    rating: 5,
    title: 'Experiencia excepcional en Cabo Real',
    comment: 'El campo está en condiciones perfectas, el servicio es de primera clase y las vistas son espectaculares. Los greens están muy bien mantenidos y el diseño del campo es desafiante pero justo. Definitivamente regresaré.',
    images: ['/images/review1-1.jpg', '/images/review1-2.jpg'],
    date: '2025-07-14T10:30:00Z',
    helpfulVotes: 12,
    isVerified: true,
    playedDate: '2025-07-10'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Ana García',
    userAvatar: '/avatars/ana.jpg',
    rating: 4,
    title: 'Muy buen campo, algunas mejoras necesarias',
    comment: 'El campo es hermoso y desafiante. El personal es amable y profesional. Las instalaciones están bien mantenidas, aunque el servicio en el restaurante podría mejorar un poco.',
    images: ['/images/review2-1.jpg'],
    date: '2025-07-13T14:20:00Z',
    helpfulVotes: 8,
    isVerified: true,
    playedDate: '2025-07-12'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'María López',
    userAvatar: '/avatars/maria.jpg',
    rating: 5,
    title: 'Campo espectacular con vistas increíbles',
    comment: 'Una experiencia inolvidable. El diseño del campo es excepcional y las instalaciones de primera. Las vistas al mar son impresionantes y cada hoyo ofrece un desafío único. Altamente recomendado para golfistas de todos los niveles.',
    images: ['/images/review3-1.jpg', '/images/review3-2.jpg', '/images/review3-3.jpg'],
    date: '2025-07-11T09:15:00Z',
    helpfulVotes: 15,
    isVerified: true,
    playedDate: '2025-07-08'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Diego Ramírez',
    userAvatar: '/avatars/diego.jpg',
    rating: 4,
    title: 'Excelente campo, precio justo',
    comment: 'El campo está muy bien mantenido y el personal es profesional. La relación calidad-precio es excelente. Los caddies son muy conocedores del campo y te ayudan a mejorar tu juego.',
    images: ['/images/review4-1.jpg'],
    date: '2025-07-10T11:30:00Z',
    helpfulVotes: 6,
    isVerified: true,
    playedDate: '2025-07-07'
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Laura Fernández',
    userAvatar: '/avatars/laura.jpg',
    rating: 5,
    title: 'Perfecto para eventos corporativos',
    comment: 'Organizamos nuestro torneo anual aquí y todo fue perfecto. Excelente organización, atención al detalle y el personal se aseguró de que todo saliera sin problemas. Las instalaciones para eventos son de primera.',
    images: ['/images/review5-1.jpg', '/images/review5-2.jpg'],
    date: '2025-07-09T13:45:00Z',
    helpfulVotes: 9,
    isVerified: true,
    playedDate: '2025-07-05'
  }
]

export default function ReviewsSection({ courseId, courseName, averageRating, totalReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedReviewImages, setSelectedReviewImages] = useState<string[]>([])

  useEffect(() => {
    // In production, fetch reviews from API
    setReviews(mockReviews)
    setFilteredReviews(mockReviews)
  }, [courseId])

  useEffect(() => {
    let filtered = reviews

    // Filter by rating
    if (selectedRating) {
      filtered = filtered.filter(review => review.rating === selectedRating)
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [reviews, selectedRating, sortBy])

  const getRatingStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`${starSize} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach(review => {
      distribution[review.rating - 1]++
    })
    return distribution.reverse() // 5 stars first
  }

  const openImageGallery = (images: string[], startIndex: number = 0) => {
    setSelectedReviewImages(images)
    setSelectedImageIndex(startIndex)
  }

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {getRatingStars(Math.round(averageRating), 'md')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {totalReviews} reseñas
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 max-w-sm">
                {getRatingDistribution().map((count, index) => {
                  const rating = 5 - index
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant={selectedRating === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                >
                  Todas
                </Button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="highest">Mejor calificadas</option>
                <option value="lowest">Menor calificadas</option>
                <option value="helpful">Más útiles</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {review.userName}
                      </span>
                      {review.isVerified && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Jugó el {formatDate(review.playedDate || review.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {getRatingStars(review.rating)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => openImageGallery(review.images, index)}
                        className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Útil ({review.helpfulVotes})
                </Button>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Reseña #{review.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {filteredReviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-8"
          >
            {showAllReviews 
              ? 'Mostrar menos reseñas' 
              : `Ver todas las reseñas (${filteredReviews.length})`
            }
          </Button>
        </div>
      )}

      {/* No Reviews Message */}
      {filteredReviews.length === 0 && (
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay reseñas con estos filtros
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajusta los filtros para ver más reseñas
            </p>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery Modal */}
      <Dialog open={selectedReviewImages.length > 0} onOpenChange={() => setSelectedReviewImages([])}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Imágenes de la reseña</DialogTitle>
          </DialogHeader>
          {selectedReviewImages.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              
              {selectedReviewImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev > 0 ? prev - 1 : selectedReviewImages.length - 1
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev < selectedReviewImages.length - 1 ? prev + 1 : 0
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {selectedReviewImages.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

