<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
          📝 Blog CraftAR
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Descubre las últimas noticias, guías y actualizaciones del servidor de Minecraft más emocionante de Argentina
        </p>
        <div class="mt-6 flex justify-center">
          <div class="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg px-6 py-3 backdrop-blur-sm">
            <span class="text-green-400 font-semibold">🎮 Minecraft 1.21.8</span>
            <span class="text-gray-300 mx-2">•</span>
            <span class="text-blue-400 font-semibold">🇦🇷 Servidor Argentino</span>
          </div>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Blog Post 1: Introducción a CraftAR -->
        <article class="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 group hover:border-craftar-500/50 transition-all duration-300">
          <div class="aspect-video bg-gradient-to-br from-craftar-600 to-craftar-800 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="text-center z-10">
              <div class="text-6xl mb-4">🏗️</div>
              <h3 class="text-2xl font-bold text-white">Bienvenido a CraftAR</h3>
            </div>
            <div class="absolute top-4 left-4 bg-craftar-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📅 15 de Enero, 2025
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-semibold border border-blue-500/30">
                🎯 Introducción
              </span>
              <span class="text-gray-400 text-sm">⏱️ 5 min de lectura</span>
            </div>
            
            <h2 class="text-2xl font-bold text-white mb-4 group-hover:text-craftar-400 transition-colors duration-300">
              ¿Qué es CraftAR? Tu Nueva Aventura en Minecraft
            </h2>
            
            <p class="text-gray-300 mb-4 leading-relaxed">
              CraftAR es el servidor de Minecraft más innovador de Argentina, diseñado específicamente para la versión 1.21.8. 
              Nuestro servidor combina la experiencia clásica de Minecraft con características únicas que hacen que cada 
              sesión de juego sea memorable.
            </p>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-green-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Sistema de Parcelas Avanzado:</strong> Construye y personaliza tu propio terreno con herramientas profesionales
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-green-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Economía Integrada:</strong> Compra y vende items usando dinero real con entrega instantánea
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-check text-green-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Comunidad Activa:</strong> Más de 1000 jugadores registrados y moderadores disponibles 24/7
                </p>
              </div>
            </div>
            
            <!-- Contenido Expandido -->
            <div v-if="isPostExpanded('post1')" class="mt-6 pt-6 border-t border-gray-700/50">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-3">🚀 Características Principales</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                      <i class="fas fa-server text-craftar-400"></i>
                      Servidor Estable
                    </h5>
                    <p class="text-gray-300 text-sm">
                      Hosting premium con 99.9% de uptime y conexión optimizada desde Argentina
                    </p>
                  </div>
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                      <i class="fas fa-shield-alt text-craftar-400"></i>
                      Anti-Cheat Avanzado
                    </h5>
                    <p class="text-gray-300 text-sm">
                      Sistema de protección contra hacks y mods no permitidos
                    </p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-craftar-600/20 to-blue-600/20 border border-craftar-500/30 rounded-lg p-4">
                  <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <i class="fas fa-rocket text-craftar-400"></i>
                    ¿Cómo Empezar?
                  </h5>
                  <ol class="text-gray-300 text-sm space-y-2 ml-4">
                    <li>1. Regístrate en nuestra plataforma web</li>
                    <li>2. Descarga Minecraft 1.21.8</li>
                    <li>3. Conéctate a: <code class="bg-gray-800 px-2 py-1 rounded text-craftar-400">craftar.com.ar</code></li>
                    <li>4. ¡Comienza tu aventura!</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-craftar-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <span class="text-gray-400 text-sm">Equipo CraftAR</span>
              </div>
              <button @click="togglePost('post1')" class="bg-gradient-to-r from-craftar-600 to-craftar-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-craftar-700 hover:to-craftar-800 transition-all duration-300">
                {{ isPostExpanded('post1') ? 'Ver Menos ↑' : 'Leer Más →' }}
              </button>
            </div>
          </div>
        </article>

        <!-- Blog Post 2: Sistema de Parcelas -->
        <article class="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 group hover:border-craftar-500/50 transition-all duration-300">
          <div class="aspect-video bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="text-center z-10">
              <div class="text-6xl mb-4">🏘️</div>
              <h3 class="text-2xl font-bold text-white">Sistema de Parcelas</h3>
            </div>
            <div class="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📅 12 de Enero, 2025
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold border border-green-500/30">
                🏗️ Guía
              </span>
              <span class="text-gray-400 text-sm">⏱️ 8 min de lectura</span>
            </div>
            
            <h2 class="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
              Domina el Sistema de Parcelas en CraftAR
            </h2>
            
            <p class="text-gray-300 mb-4 leading-relaxed">
              El sistema de parcelas de CraftAR te permite crear y administrar tu propio territorio de manera profesional. 
              Desde la selección del terreno hasta la construcción de estructuras complejas, aquí tienes todo lo que necesitas saber.
            </p>
            
            <div class="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600/50">
              <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-map text-green-400"></i>
                Tipos de Parcelas Disponibles
              </h4>
              <ul class="space-y-2 text-sm text-gray-300">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Parcelas Básicas:</strong> 50x50 bloques - Perfectas para principiantes
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <strong>Parcelas Premium:</strong> 100x100 bloques - Para construcciones avanzadas
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <strong>Parcelas VIP:</strong> 200x200 bloques - Para proyectos épicos
                </li>
              </ul>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-tools text-green-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Herramientas de Construcción:</strong> WorldEdit integrado para construcciones rápidas y precisas
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-shield-alt text-green-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Protección Total:</strong> Tus construcciones están protegidas contra griefing y vandalismo
                </p>
              </div>
            </div>
            
            <!-- Contenido Expandido -->
            <div v-if="isPostExpanded('post2')" class="mt-6 pt-6 border-t border-gray-700/50">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-3">🛠️ Comandos Esenciales</h4>
                <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 class="text-white font-semibold mb-2">Comandos Básicos:</h5>
                      <ul class="text-gray-300 space-y-1">
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/plot claim</code> - Reclamar parcela</li>
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/plot home</code> - Ir a tu parcela</li>
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/plot info</code> - Información de parcela</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="text-white font-semibold mb-2">Comandos Avanzados:</h5>
                      <ul class="text-gray-300 space-y-1">
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/we</code> - WorldEdit</li>
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/plot add</code> - Agregar amigo</li>
                        <li><code class="bg-gray-800 px-2 py-1 rounded text-green-400">/plot deny</code> - Denegar acceso</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-4">
                  <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <i class="fas fa-lightbulb text-green-400"></i>
                    Consejos Pro
                  </h5>
                  <ul class="text-gray-300 text-sm space-y-2 ml-4">
                    <li>• Usa WorldEdit para construcciones grandes y simétricas</li>
                    <li>• Protege tu parcela agregando solo amigos de confianza</li>
                    <li>• Planifica tu construcción antes de empezar</li>
                    <li>• Participa en concursos de construcción para ganar premios</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-hammer text-white text-sm"></i>
                </div>
                <span class="text-gray-400 text-sm">Constructor Pro</span>
              </div>
              <button @click="togglePost('post2')" class="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300">
                {{ isPostExpanded('post2') ? 'Ver Menos ↑' : 'Leer Más →' }}
              </button>
            </div>
          </div>
        </article>

        <!-- Blog Post 3: Economía del Servidor -->
        <article class="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 group hover:border-craftar-500/50 transition-all duration-300">
          <div class="aspect-video bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="text-center z-10">
              <div class="text-6xl mb-4">💰</div>
              <h3 class="text-2xl font-bold text-white">Economía Real</h3>
            </div>
            <div class="absolute top-4 left-4 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📅 10 de Enero, 2025
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold border border-yellow-500/30">
                💎 Economía
              </span>
              <span class="text-gray-400 text-sm">⏱️ 6 min de lectura</span>
            </div>
            
            <h2 class="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
              Cómo Funciona la Economía Real en CraftAR
            </h2>
            
            <p class="text-gray-300 mb-4 leading-relaxed">
              CraftAR revoluciona la experiencia de Minecraft al integrar una economía real donde puedes ganar dinero 
              vendiendo items y servicios. Descubre cómo convertir tu pasión por Minecraft en ingresos reales.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                  <i class="fas fa-shopping-cart text-yellow-400"></i>
                  Tienda Integrada
                </h4>
                <p class="text-gray-300 text-sm">
                  Compra items con dinero real y recíbelos instantáneamente en el servidor
                </p>
              </div>
              <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                  <i class="fas fa-coins text-yellow-400"></i>
                  Sistema de Monedas
                </h4>
                <p class="text-gray-300 text-sm">
                  Gana monedas del juego completando misiones y eventos especiales
                </p>
              </div>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-credit-card text-yellow-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Pagos Seguros:</strong> Integración con MercadoPago para transacciones seguras y confiables
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-bolt text-yellow-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Entrega Instantánea:</strong> Recibe tus items inmediatamente después del pago
                </p>
              </div>
            </div>
            
            <!-- Contenido Expandido -->
            <div v-if="isPostExpanded('post3')" class="mt-6 pt-6 border-t border-gray-700/50">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-3">💳 Métodos de Pago</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 text-center">
                    <div class="text-3xl mb-2">💳</div>
                    <h5 class="text-white font-semibold mb-2">Tarjeta de Crédito</h5>
                    <p class="text-gray-300 text-sm">Visa, Mastercard, American Express</p>
                  </div>
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 text-center">
                    <div class="text-3xl mb-2">🏦</div>
                    <h5 class="text-white font-semibold mb-2">Transferencia</h5>
                    <p class="text-gray-300 text-sm">Transferencia bancaria directa</p>
                  </div>
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 text-center">
                    <div class="text-3xl mb-2">📱</div>
                    <h5 class="text-white font-semibold mb-2">Billetera Digital</h5>
                    <p class="text-gray-300 text-sm">MercadoPago, Ualá, Nubi</p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-yellow-600/20 to-green-600/20 border border-yellow-500/30 rounded-lg p-4">
                  <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <i class="fas fa-coins text-yellow-400"></i>
                    Cómo Ganar Monedas
                  </h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h6 class="text-white font-semibold mb-1">Actividades Diarias:</h6>
                      <ul class="text-gray-300 space-y-1">
                        <li>• Conectar diariamente: +100 monedas</li>
                        <li>• Completar misiones: +500 monedas</li>
                        <li>• Participar en eventos: +1000 monedas</li>
                      </ul>
                    </div>
                    <div>
                      <h6 class="text-white font-semibold mb-1">Actividades Especiales:</h6>
                      <ul class="text-gray-300 space-y-1">
                        <li>• Ganar torneos: +5000 monedas</li>
                        <li>• Construcción destacada: +2000 monedas</li>
                        <li>• Ayudar nuevos jugadores: +300 monedas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-chart-line text-white text-sm"></i>
                </div>
                <span class="text-gray-400 text-sm">Economista Digital</span>
              </div>
              <button @click="togglePost('post3')" class="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300">
                {{ isPostExpanded('post3') ? 'Ver Menos ↑' : 'Leer Más →' }}
              </button>
            </div>
          </div>
        </article>

        <!-- Blog Post 4: Eventos y Comunidad -->
        <article class="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 group hover:border-craftar-500/50 transition-all duration-300">
          <div class="aspect-video bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="text-center z-10">
              <div class="text-6xl mb-4">🎉</div>
              <h3 class="text-2xl font-bold text-white">Eventos Especiales</h3>
            </div>
            <div class="absolute top-4 left-4 bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📅 8 de Enero, 2025
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-semibold border border-purple-500/30">
                🎊 Eventos
              </span>
              <span class="text-gray-400 text-sm">⏱️ 7 min de lectura</span>
            </div>
            
            <h2 class="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
              Únete a los Eventos Más Épicos de CraftAR
            </h2>
            
            <p class="text-gray-300 mb-4 leading-relaxed">
              La comunidad de CraftAR es conocida por sus eventos increíbles y actividades regulares. 
              Desde torneos de construcción hasta eventos de supervivencia, siempre hay algo emocionante sucediendo.
            </p>
            
            <div class="space-y-4 mb-6">
              <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                  <i class="fas fa-trophy text-purple-400"></i>
                  Torneos Semanales
                </h4>
                <p class="text-gray-300 text-sm mb-2">
                  Compite en torneos de construcción, PvP y supervivencia con premios increíbles
                </p>
                <div class="flex items-center gap-4 text-xs text-gray-400">
                  <span>🏆 1er lugar: $50.000 ARS</span>
                  <span>🥈 2do lugar: $25.000 ARS</span>
                  <span>🥉 3er lugar: $10.000 ARS</span>
                </div>
              </div>
              
              <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-purple-400"></i>
                  Eventos Especiales
                </h4>
                <p class="text-gray-300 text-sm">
                  Celebra Halloween, Navidad y otros eventos temáticos con recompensas exclusivas
                </p>
              </div>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-users text-purple-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Comunidad Activa:</strong> Más de 1000 jugadores registrados y moderadores disponibles 24/7
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="fas fa-headset text-purple-400 text-xs"></i>
                </div>
                <p class="text-gray-300 text-sm">
                  <strong class="text-white">Soporte Premium:</strong> Equipo de moderadores profesionales para ayudarte en todo momento
                </p>
              </div>
            </div>
            
            <!-- Contenido Expandido -->
            <div v-if="isPostExpanded('post4')" class="mt-6 pt-6 border-t border-gray-700/50">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-3">📅 Calendario de Eventos</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                      <i class="fas fa-calendar-week text-purple-400"></i>
                      Eventos Semanales
                    </h5>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Lunes: Torneo de Construcción</li>
                      <li>• Miércoles: PvP Arena</li>
                      <li>• Viernes: Evento de Supervivencia</li>
                      <li>• Domingo: Gran Torneo Final</li>
                    </ul>
                  </div>
                  <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                      <i class="fas fa-gift text-purple-400"></i>
                      Eventos Especiales
                    </h5>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Halloween: Mundo de Terror</li>
                      <li>• Navidad: Aldea Navideña</li>
                      <li>• Año Nuevo: Fiesta de Fuegos</li>
                      <li>• Verano: Festival de Playa</li>
                    </ul>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                  <h5 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <i class="fas fa-users text-purple-400"></i>
                    Comunidad y Discord
                  </h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h6 class="text-white font-semibold mb-1">Canales Principales:</h6>
                      <ul class="text-gray-300 space-y-1">
                        <li>• #general - Chat general</li>
                        <li>• #eventos - Anuncios de eventos</li>
                        <li>• #soporte - Ayuda técnica</li>
                        <li>• #construcciones - Mostrar builds</li>
                      </ul>
                    </div>
                    <div>
                      <h6 class="text-white font-semibold mb-1">Roles Disponibles:</h6>
                      <ul class="text-gray-300 space-y-1">
                        <li>• Constructor - Acceso a herramientas</li>
                        <li>• VIP - Beneficios exclusivos</li>
                        <li>• Moderador - Ayuda a la comunidad</li>
                        <li>• Evento - Participación especial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-star text-white text-sm"></i>
                </div>
                <span class="text-gray-400 text-sm">Organizador de Eventos</span>
              </div>
              <button @click="togglePost('post4')" class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                {{ isPostExpanded('post4') ? 'Ver Menos ↑' : 'Leer Más →' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Newsletter Section -->
      <div class="bg-gradient-to-r from-craftar-600/20 to-purple-600/20 border border-craftar-500/30 rounded-2xl p-8 mb-12 backdrop-blur-sm">
        <div class="text-center">
          <h3 class="text-3xl font-bold text-white mb-4">
            📧 Mantente Actualizado
          </h3>
          <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter para recibir las últimas noticias, actualizaciones del servidor y eventos especiales directamente en tu correo.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="tu@email.com"
              class="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-craftar-500 focus:ring-2 focus:ring-craftar-500/20"
            >
            <button class="bg-gradient-to-r from-craftar-600 to-craftar-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-craftar-700 hover:to-craftar-800 transition-all duration-300">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <!-- Mensaje para usuarios no logueados -->
        <div v-if="!authStore.isAuthenticated">
          <h3 class="text-3xl font-bold text-white mb-4">
            ¿Listo para Unirte a CraftAR?
          </h3>
          <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la comunidad más emocionante de Minecraft en Argentina y comienza tu aventura épica hoy mismo.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/shop" class="bg-gradient-to-r from-craftar-600 to-craftar-700 text-white font-semibold py-4 px-8 rounded-lg hover:from-craftar-700 hover:to-craftar-800 transition-all duration-300">
              <i class="fas fa-shopping-cart mr-2"></i>
              Explorar Tienda
            </router-link>
            <router-link to="/login" class="bg-transparent border-2 border-craftar-500 text-craftar-400 font-semibold py-4 px-8 rounded-lg hover:bg-craftar-500 hover:text-white transition-all duration-300">
              <i class="fas fa-sign-in-alt mr-2"></i>
              Iniciar Sesión
            </router-link>
          </div>
        </div>
        
        <!-- Mensaje para usuarios logueados -->
        <div v-else>
          <h3 class="text-3xl font-bold text-white mb-4">
            ¡Bienvenido de vuelta, {{ authStore.user?.username }}!
          </h3>
          <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
            Continúa explorando nuestro blog y descubre nuevas formas de disfrutar tu experiencia en CraftAR.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/dashboard" class="bg-gradient-to-r from-craftar-600 to-craftar-700 text-white font-semibold py-4 px-8 rounded-lg hover:from-craftar-700 hover:to-craftar-800 transition-all duration-300">
              <i class="fas fa-tachometer-alt mr-2"></i>
              Mi Dashboard
            </router-link>
            <router-link to="/shop" class="bg-transparent border-2 border-craftar-500 text-craftar-400 font-semibold py-4 px-8 rounded-lg hover:bg-craftar-500 hover:text-white transition-all duration-300">
              <i class="fas fa-shopping-cart mr-2"></i>
              Explorar Tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const expandedPosts = ref(new Set())

const togglePost = (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const isPostExpanded = (postId) => {
  return expandedPosts.value.has(postId)
}

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Custom animations for blog cards */
.group:hover {
  transform: translateY(-4px);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}
</style>
