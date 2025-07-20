'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { 
  Users, Search, Filter, Plus, Edit, Trash2, Eye, 
  Shield, ShieldCheck, UserCheck, UserX, Mail, Phone,
  Calendar, Activity, MoreVertical, Download
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  totalBookings: number
  totalSpent: number
  lastActivity: string
  joinDate: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Oscar Gómez',
    email: 'oscar@teereserve.golf',
    phone: '+52 555 987 6543',
    role: 'admin',
    status: 'active',
    totalBookings: 45,
    totalSpent: 6750,
    lastActivity: '2025-07-15T10:30:00Z',
    joinDate: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria.lopez@email.com',
    phone: '+52 555 123 4567',
    role: 'user',
    status: 'active',
    totalBookings: 23,
    totalSpent: 3450,
    lastActivity: '2025-07-14T16:45:00Z',
    joinDate: '2024-03-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    phone: '+52 555 234 5678',
    role: 'user',
    status: 'active',
    totalBookings: 18,
    totalSpent: 2700,
    lastActivity: '2025-07-13T09:15:00Z',
    joinDate: '2024-05-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    phone: '+52 555 345 6789',
    role: 'manager',
    status: 'active',
    totalBookings: 12,
    totalSpent: 1800,
    lastActivity: '2025-07-12T14:20:00Z',
    joinDate: '2024-02-28T00:00:00Z'
  },
  {
    id: '5',
    name: 'Luis Martínez',
    email: 'luis.martinez@email.com',
    phone: '+52 555 456 7890',
    role: 'user',
    status: 'inactive',
    totalBookings: 8,
    totalSpent: 1200,
    lastActivity: '2025-06-15T11:30:00Z',
    joinDate: '2024-04-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Sofia Hernández',
    email: 'sofia.hernandez@email.com',
    phone: '+52 555 567 8901',
    role: 'user',
    status: 'suspended',
    totalBookings: 5,
    totalSpent: 750,
    lastActivity: '2025-07-01T08:45:00Z',
    joinDate: '2024-06-12T00:00:00Z'
  }
]

export default function UsersManagementPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'user': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-4 h-4" />
      case 'manager': return <Shield className="w-4 h-4" />
      case 'user': return <UserCheck className="w-4 h-4" />
      default: return <UserCheck className="w-4 h-4" />
    }
  }

  const handleUserAction = (action: string, userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'activate':
              return { ...user, status: 'active' as const }
            case 'deactivate':
              return { ...user, status: 'inactive' as const }
            case 'suspend':
              return { ...user, status: 'suspended' as const }
            default:
              return user
          }
        }
        return user
      })
    )
  }

  const exportUsers = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'Rol', 'Estado', 'Reservas', 'Gastado', 'Último Acceso', 'Fecha Registro'].join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.status,
        user.totalBookings,
        user.totalSpent,
        formatDateTime(user.lastActivity),
        formatDate(user.joinDate)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'usuarios-teereserve.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-beige-50 to-golf-beige-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-golf-green-800 dark:text-golf-green-400 font-playfair">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-montserrat">
              Administra usuarios, roles y permisos
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={exportUsers}
              variant="outline"
              className="border-golf-green-600 text-golf-green-600 hover:bg-golf-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            
            <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Usuarios
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Usuarios Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Administradores
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Suspendidos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {users.filter(u => u.status === 'suspended').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <UserX className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
              Lista de Usuarios ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-golf-green-100 rounded-full flex items-center justify-center">
                        <span className="text-golf-green-600 font-semibold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {user.name}
                        </h4>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          <span className="capitalize">{user.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{user.totalBookings} reservas</span>
                        <span>•</span>
                        <span>{formatCurrency(user.totalSpent)} gastado</span>
                        <span>•</span>
                        <span>Último acceso: {formatDateTime(user.lastActivity)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUserModal(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>

                    {user.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction('suspend', user.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserAction('activate', user.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Detail Modal */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-golf-green-800">
                Detalles del Usuario
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-golf-green-100 rounded-full flex items-center justify-center">
                    <span className="text-golf-green-600 font-bold text-2xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {selectedUser.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleColor(selectedUser.role)}>
                        {getRoleIcon(selectedUser.role)}
                        <span className="ml-1 capitalize">{selectedUser.role}</span>
                      </Badge>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        <span className="capitalize">{selectedUser.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Información de Contacto
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedUser.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Registrado: {formatDate(selectedUser.joinDate)}
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                        Último acceso: {formatDateTime(selectedUser.lastActivity)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Estadísticas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total de Reservas:
                        </span>
                        <span className="font-semibold">
                          {selectedUser.totalBookings}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Gastado:
                        </span>
                        <span className="font-semibold text-golf-green-600">
                          {formatCurrency(selectedUser.totalSpent)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Promedio por Reserva:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(selectedUser.totalSpent / selectedUser.totalBookings || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowUserModal(false)}>
                    Cerrar
                  </Button>
                  <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white">
                    Editar Usuario
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  )
}

