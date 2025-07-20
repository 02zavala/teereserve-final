"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    handicap: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Error signing up with Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to sign in page
        router.push("/auth/signin?message=Cuenta creada exitosamente")
      } else {
        const error = await response.json()
        alert(error.message || "Error al crear la cuenta")
      }
    } catch (error) {
      console.error("Error registering:", error)
      alert("Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-green-400 via-golf-gold-300 to-golf-green-500 flex items-center justify-center p-4">
      {/* Tornasol overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-golf-green-600/80 via-golf-gold-400/60 to-golf-green-700/80"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/golf-pattern.svg"
          alt=""
          fill
          className="object-repeat"
        />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mb-4">
            <Image
              src="/icon.svg"
              alt="TeeReserve Golf"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-golf-green-600">
            Únete a TeeReserve
          </CardTitle>
          <CardDescription className="text-golf-green-700">
            Crea tu cuenta y accede a los mejores campos de golf
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Sign Up */}
          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full bg-white border-2 border-golf-green-600 text-golf-green-700 hover:bg-golf-green-50 py-6 text-lg font-semibold"
            size="lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Registrarse con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-golf-green-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-golf-green-600 font-medium">o completa tus datos</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-golf-green-700 font-medium">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                className="border-golf-green-300 focus:border-golf-green-500 focus:ring-golf-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-golf-green-700 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@email.com"
                value={formData.email}
                onChange={handleChange}
                className="border-golf-green-300 focus:border-golf-green-500 focus:ring-golf-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-golf-green-700 font-medium">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="border-golf-green-300 focus:border-golf-green-500 focus:ring-golf-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-golf-green-700 font-medium">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 624 135 2986"
                value={formData.phone}
                onChange={handleChange}
                className="border-golf-green-300 focus:border-golf-green-500 focus:ring-golf-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handicap" className="text-golf-green-700 font-medium">Handicap (opcional)</Label>
              <Input
                id="handicap"
                name="handicap"
                type="number"
                placeholder="12"
                step="0.1"
                min="0"
                max="54"
                value={formData.handicap}
                onChange={handleChange}
                className="border-golf-green-300 focus:border-golf-green-500 focus:ring-golf-green-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-golf-green-600 hover:bg-golf-green-700 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-golf-green-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/signin" className="font-medium text-golf-gold-600 hover:text-golf-gold-700">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-golf-green-600 hover:text-golf-green-700">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
