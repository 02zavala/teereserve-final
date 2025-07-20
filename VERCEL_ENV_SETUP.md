# 🚀 Configuración de Variables de Entorno en Vercel

## 📋 Pasos para Configurar en Vercel Dashboard

### 1. Ve a tu proyecto en Vercel
- Abre [vercel.com](https://vercel.com)
- Selecciona tu proyecto "teereserve-golf"
- Ve a "Settings" > "Environment Variables"

### 2. Agrega estas variables una por una:

#### ✅ Variables BÁSICAS (mínimo requerido)
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://teereserve-golf.vercel.app
NEXTAUTH_URL=https://teereserve-golf.vercel.app
NEXTAUTH_SECRET=teereserve-golf-super-secret-key-2025
DATABASE_URL=file:./mock.db
```

#### 🔑 Google OAuth (para login)
```env
GOOGLE_CLIENT_ID=7459999729-85s7bcf8ckknckn0mhdhcgf1ejrp91oq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

#### 🗺️ Google Maps (para mapas)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBvFjnvNnhQ7ljYQmLzQzJ3XlK_demo_key
```

#### 💳 Stripe (para pagos)
```env
STRIPE_PUBLISHABLE_KEY=pk_test_51RgA7DA3xd8nXx5stG7e4vJooByjwqaadQehRPEP5QKZaiujCsZr6ZuRuyiCm4cCjCKiYFrdvqfcw4KhEDkQgCF100SfCqvEjo
STRIPE_SECRET_KEY=sk_test_51RgA7DA3xd8nXx5sXws8EBHcCmXlSfSVNkU2BjMPg2RbVszCXDn80sKTzJqy2D6aGsjq17tQN62mPVxCGrqmswzY00eWyRDsu9
```

#### 📱 WhatsApp/Twilio (para mensajes)
```env
TWILIO_ACCOUNT_SID=demo
TWILIO_AUTH_TOKEN=demo
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

#### 📧 Email (opcional)
```env
RESEND_API_KEY=demo
```

### 3. ⚡ Redeploy
Después de configurar las variables:
- Ve a "Deployments"
- Click en "Redeploy" en el último deployment
- ¡Tu sitio estará funcionando!

## 🌐 URLs Resultado

Después del deployment tendrás:
- **Homepage:** https://teereserve-golf.vercel.app
- **API Health:** https://teereserve-golf.vercel.app/api/health
- **Campos:** https://teereserve-golf.vercel.app/courses
- **Admin:** https://teereserve-golf.vercel.app/admin

## ✅ Verificación

Prueba estos endpoints:
```bash
curl https://teereserve-golf.vercel.app/api/health
curl https://teereserve-golf.vercel.app/api/courses
curl https://teereserve-golf.vercel.app/api/admin/stats
```

## 🔧 Si algo falla:

1. **Verifica build logs:** Vercel Dashboard > Deployments > View Function Logs
2. **Revisa variables:** Settings > Environment Variables
3. **Redeploy:** Deployments > Redeploy

## 🚀 ¡Listo!

Con estas configuraciones, TeeReserve Golf funcionará perfectamente en Vercel con datos mock, listo para recibir usuarios reales y dominar el mercado mexicano de golf! 🏌️‍♂️⛳
