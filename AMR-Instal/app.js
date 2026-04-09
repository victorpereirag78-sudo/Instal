// =======================================================
// --- CONFIGURACIÓN DE SUPABASE ---
// =======================================================
// Usar el cliente global inicializado en index.html (window.supabaseClient)
const supabase = window.supabaseClient;





function mostrarLoader(mensaje = 'Cargando...') {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        const div = document.createElement('div');
        div.id = 'global-loader';
        div.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>${mensaje}</p>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        loader = div; // ← asignar el nuevo elemento a loader
    }
    loader.style.display = 'flex';
}

function ocultarLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'none';
}

// Verificación de seguridad
if (!window.CONFIG?.supabase?.url || !window.CONFIG?.supabase?.anonKey) {
    alert(`⚠️ Error: No se pudo cargar la configuración de Supabase, Verifica config.js`);
    throw new Error('Configuración faltante');
}

console.log('✅ Configuración cargada correctamente');

// =======================================================
// --- Datos Centralizados y Estado de la Aplicación ---
// =======================================================

const appData = {
    regiones: {
        "13": { nombre: "Región Metropolitana", comunas: [
            "Alhué","Buin","Calera de Tango","Cerrillos","Cerro Navia","Colina",
            "Conchalí","Curacaví","El Bosque","El Monte","Estación Central","Huechuraba",
            "Independencia","Isla de Maipo","La Cisterna","La Florida","La Granja","La Pintana",
            "La Reina","Lampa","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul",
            "Maipú","María Pinto","Melipilla","Ñuñoa","Padre Hurtado","Paine","Pedro Aguirre Cerda",
            "Peñaflor","Peñalolén","Pirque","Providencia","Pudahuel","Puente Alto","Quilicura",
            "Quinta Normal","Recoleta","Renca","San Bernardo","San Joaquín","San José de Maipo",
            "San Miguel","San Pedro","San Ramón","Santiago","Talagante","Til Til","Vitacura"
        ]},
    },
    // ═══════════════════════════════════════════════════
    // --- SERVICIOS Y SUBSERVICIOS ACTUALIZADOS ---
    // ═══════════════════════════════════════════════════
    servicios: {
    "Alta": [
        "Alta net", "Alta net + 1 ext", "Alta net + 2 ext", "Alta net + 3 ext", "Alta net + 4 ext",
        "Alta net + tv", "Alta net + tv + 1 ext", "Alta net + tv + 2 ext", "Alta net + tv + 3 ext", "Alta net + tv + 4 ext",
        "Alta net + tv + 1 deco", "Alta net + tv + 1 deco + 1 ext", "Alta net + tv + 1 deco + 2 ext",
        "Alta net + tv + 1 deco + 3 ext", "Alta net + tv + 1 deco + 4 ext",
        "Alta net + tv + 2 deco", "Alta net + tv + 2 deco + 1 ext", "Alta net + tv + 2 deco + 2 ext",
        "Alta net + tv + 2 deco + 3 ext", "Alta net + tv + 2 deco + 4 ext",
        "Alta net + tv + 3 deco", "Alta net + tv + 3 deco + 1 ext", "Alta net + tv + 3 deco + 2 ext",
        "Alta net + tv + 3 deco + 3 ext", "Alta net + tv + 3 deco + 4 ext",
        "Alta net + tv + 4 deco", "Alta net + tv + 4 deco + 1 ext", "Alta net + tv + 4 deco + 2 ext",
        "Alta net + tv + 4 deco + 3 ext", "Alta net + tv + 4 deco + 4 ext",
        "Alta net + tv + 5 deco", "Alta net + tv + 5 deco + 1 ext", "Alta net + tv + 5 deco + 2 ext",
        "Alta net + tv + 5 deco + 3 ext", "Alta net + tv + 5 deco + 4 ext"
    ],
    "Migracion": [
        "Migracion net", "Migracion net + 1 ext", "Migracion net + 2 ext", "Migracion net+ 3 ext", "Migracion net + 4 ext",
        "Migracion + tv", "Migracion + tv + 1 ext", "Migracion + tv + 2 ext", "Migracion + tv + 3 ext", "Migracion + tv + 4 ext",
        "Migracion + tv + 1 deco", "Migracion + tv + 1 deco + 1 ext", "Migracion + tv + 1 deco + 2 ext",
        "Migracion + tv + 1 deco + 3 ext", "Migracion + tv + 1 deco + 4 ext",
        "Migracion + tv + 2 deco", "Migracion + tv + 2 deco + 1 ext", "Migracion + tv + 2 deco + 2 ext",
        "Migracion + tv + 2 deco + 3 ext", "Migracion + tv + 2 deco + 4 ext",
        "Migracion + tv + 3 deco", "Migracion + tv + 3 deco + 1 ext", "Migracion + tv + 3 deco + 2 ext",
        "Migracion + tv + 3 deco + 3 ext", "Migracion + tv + 3 deco + 4 ext",
        "Migracion + tv + 4 deco", "Migracion + tv + 4 deco + 1 ext", "Migracion + tv + 4 deco + 2 ext",
        "Migracion + tv + 4 deco + 3 ext", "Migracion + tv + 4 deco + 4 ext",
        "Migracion + tv + 5 deco", "Migracion + tv + 5 deco + 1 ext", "Migracion + tv + 5 deco + 2 ext",
        "Migracion + tv + 5 deco + 3 ext", "Migracion + tv + 5 deco + 4 ext"
    ],
    "AltaTraslado": [
        "AltaTraslado net", "AltaTraslado net + 1 ext", "AltaTraslado net + 2 ext", "AltaTraslado net + 3 ext", "AltaTraslado net + 4 ext",
        "AltaTraslado + tv", "AltaTraslado + tv + 1 ext", "AltaTraslado + tv + 2 ext", "AltaTraslado + tv + 3 ext", "AltaTraslado + tv + 4 ext",
        "AltaTraslado + tv + 1 deco", "AltaTraslado + tv + 1 deco + 1 ext", "AltaTraslado + tv + 1 deco + 2 ext",
        "AltaTraslado + tv + 1 deco + 3 ext", "AltaTraslado + tv + 1 deco + 4 ext",
        "AltaTraslado + tv + 2 deco", "AltaTraslado + tv + 2 deco + 1 ext", "AltaTraslado + tv + 2 deco + 2 ext",
        "AltaTraslado + tv + 2 deco + 3 ext", "AltaTraslado + tv + 2 deco + 4 ext",
        "AltaTraslado + tv + 3 deco", "AltaTraslado + tv + 3 deco + 1 ext", "AltaTraslado + tv + 3 deco + 2 ext",
        "AltaTraslado + tv + 3 deco + 3 ext", "AltaTraslado + tv + 3 deco + 4 ext",
        "AltaTraslado + tv + 4 deco", "AltaTraslado + tv + 4 deco + 1 ext", "AltaTraslado + tv + 4 deco + 2 ext",
        "AltaTraslado + tv + 4 deco + 3 ext", "AltaTraslado + tv + 4 deco + 4 ext",
        "AltaTraslado + tv + 5 deco", "AltaTraslado + tv + 5 deco + 1 ext", "AltaTraslado + tv + 5 deco + 2 ext",
        "AltaTraslado + tv + 5 deco + 3 ext", "AltaTraslado + tv + 5 deco + 4 ext"
    ],
    "Modificaciones": [
        "Modificaciones de Instalacion",
        "Modificaciones \"1 Extensor Adicional\"", "Modificaciones \"2 Extensor Adicional\"",
        "Modificaciones \"3 Extensor Adicional\"", "Modificaciones \"4 Extensor Adicional\"",
        "Modificaciones \"1 Deco Adicional\"", "Modificaciones \"2 Deco Adicional\"",
        "Modificaciones \"3 Deco Adicional\"", "Modificaciones \"4 Deco Adicional\"",
        "Modificaciones \" 1 deco + 1 ext\"", "Modificaciones \" 1 deco + 2 ext\"",
        "Modificaciones \" 1 deco + 3 ext\"", "Modificaciones \" 1 deco + 4 ext\"",
        "Modificaciones \"2 deco + 1 ext\"", "Modificaciones \"2 deco + 2 ext\"",
        "Modificaciones \"2 deco + 3 ext\"", "Modificaciones \"2 deco + 4 ext\"",
        "Modificaciones  \"3 deco + 1 ext\"", "Modificaciones  \"3 deco + 2 ext\"",
        "Modificaciones  \"3 deco + 3 ext\"", "Modificaciones  \"3 deco + 4 ext\"",
        "Modificaciones \"4 deco + 1 ext\"", "Modificaciones \"4 deco + 2 ext\"",
        "Modificaciones \"4 deco + 3 ext\"", "Modificaciones \"4 deco + 4 ext\"",
        "Modificaciones \"5 deco + 1 ext\"", "Modificaciones \"5 deco + 2 ext\"",
        "Modificaciones \"5 deco + 3 ext\"", "Modificaciones \"5 deco + 4 ext\""
    ],
    "Reparacion": ["VT"]
    },

    // ═══════════════════════════════════════════════════
// --- PUNTAJES POR SUBSERVICIO (para producción) ---
// ═══════════════════════════════════════════════════
puntajesServicios: {
    // === ALTA ===
        "Alta net": 1, "Alta net + 1 ext": 1.75, "Alta net + 2 ext": 2.5, "Alta net + 3 ext": 3.25, "Alta net + 4 ext": 4,
        "Alta net + tv": 2, "Alta net + tv + 1 ext": 2.75, "Alta net + tv + 2 ext": 3.5, "Alta net + tv + 3 ext": 4.25, "Alta net + tv + 4 ext": 5,
        "Alta net + tv + 1 deco": 2.5, "Alta net + tv + 1 deco + 1 ext": 3.25, "Alta net + tv + 1 deco + 2 ext": 4,
        "Alta net + tv + 1 deco + 3 ext": 4.75, "Alta net + tv + 1 deco + 4 ext": 5.5,
        "Alta net + tv + 2 deco": 3, "Alta net + tv + 2 deco + 1 ext": 3.75, "Alta net + tv + 2 deco + 2 ext": 4.5,
        "Alta net + tv + 2 deco + 3 ext": 5.25, "Alta net + tv + 2 deco + 4 ext": 6,
        "Alta net + tv + 3 deco": 3.5, "Alta net + tv + 3 deco + 1 ext": 4.25, "Alta net + tv + 3 deco + 2 ext": 5,
        "Alta net + tv + 3 deco + 3 ext": 5.75, "Alta net + tv + 3 deco + 4 ext": 6.5,
        "Alta net + tv + 4 deco": 4, "Alta net + tv + 4 deco + 1 ext": 4.75, "Alta net + tv + 4 deco + 2 ext": 5.5,
        "Alta net + tv + 4 deco + 3 ext": 6.25, "Alta net + tv + 4 deco + 4 ext": 7,
        "Alta net + tv + 5 deco": 4.5, "Alta net + tv + 5 deco + 1 ext": 5.25, "Alta net + tv + 5 deco + 2 ext": 6,
        "Alta net + tv + 5 deco + 3 ext": 6.75, "Alta net + tv + 5 deco + 4 ext": 7.5,
        
        // === MIGRACION ===
        "Migracion net": 1, "Migracion net + 1 ext": 1.75, "Migracion net + 2 ext": 2.5, "Migracion net+ 3 ext": 3.25, "Migracion net + 4 ext": 4,
        "Migracion + tv": 2, "Migracion + tv + 1 ext": 2.75, "Migracion + tv + 2 ext": 3.5, "Migracion + tv + 3 ext": 4.25, "Migracion + tv + 4 ext": 5,
        "Migracion + tv + 1 deco": 2.5, "Migracion + tv + 1 deco + 1 ext": 3.25, "Migracion + tv + 1 deco + 2 ext": 4,
        "Migracion + tv + 1 deco + 3 ext": 4.75, "Migracion + tv + 1 deco + 4 ext": 5.5,
        "Migracion + tv + 2 deco": 3, "Migracion + tv + 2 deco + 1 ext": 3.75, "Migracion + tv + 2 deco + 2 ext": 4.5,
        "Migracion + tv + 2 deco + 3 ext": 5.25, "Migracion + tv + 2 deco + 4 ext": 6,
        "Migracion + tv + 3 deco": 3.5, "Migracion + tv + 3 deco + 1 ext": 4.25, "Migracion + tv + 3 deco + 2 ext": 5,
        "Migracion + tv + 3 deco + 3 ext": 5.75, "Migracion + tv + 3 deco + 4 ext": 6.5,
        "Migracion + tv + 4 deco": 4, "Migracion + tv + 4 deco + 1 ext": 4.75, "Migracion + tv + 4 deco + 2 ext": 5.5,
        "Migracion + tv + 4 deco + 3 ext": 6.25, "Migracion + tv + 4 deco + 4 ext": 7,
        "Migracion + tv + 5 deco": 4.5, "Migracion + tv + 5 deco + 1 ext": 5.25, "Migracion + tv + 5 deco + 2 ext": 6,
        "Migracion + tv + 5 deco + 3 ext": 6.75, "Migracion + tv + 5 deco + 4 ext": 7.5,
        
        // === ALTATRASLADO ===
        "AltaTraslado net": 1, "AltaTraslado net + 1 ext": 1.75, "AltaTraslado net + 2 ext": 2.5, "AltaTraslado net + 3 ext": 3.25, "AltaTraslado net + 4 ext": 4,
        "AltaTraslado + tv": 2, "AltaTraslado + tv + 1 ext": 2.75, "AltaTraslado + tv + 2 ext": 3.5, "AltaTraslado + tv + 3 ext": 4.25, "AltaTraslado + tv + 4 ext": 5,
        "AltaTraslado + tv + 1 deco": 2.5, "AltaTraslado + tv + 1 deco + 1 ext": 3.25, "AltaTraslado + tv + 1 deco + 2 ext": 4,
        "AltaTraslado + tv + 1 deco + 3 ext": 4.75, "AltaTraslado + tv + 1 deco + 4 ext": 5.5,
        "AltaTraslado + tv + 2 deco": 3, "AltaTraslado + tv + 2 deco + 1 ext": 3.75, "AltaTraslado + tv + 2 deco + 2 ext": 4.5,
        "AltaTraslado + tv + 2 deco + 3 ext": 5.25, "AltaTraslado + tv + 2 deco + 4 ext": 6,
        "AltaTraslado + tv + 3 deco": 3.5, "AltaTraslado + tv + 3 deco + 1 ext": 4.25, "AltaTraslado + tv + 3 deco + 2 ext": 5,
        "AltaTraslado + tv + 3 deco + 3 ext": 5.75, "AltaTraslado + tv + 3 deco + 4 ext": 6.5,
        "AltaTraslado + tv + 4 deco": 4, "AltaTraslado + tv + 4 deco + 1 ext": 4.75, "AltaTraslado + tv + 4 deco + 2 ext": 5.5,
        "AltaTraslado + tv + 4 deco + 3 ext": 6.25, "AltaTraslado + tv + 4 deco + 4 ext": 7,
        "AltaTraslado + tv + 5 deco": 4.5, "AltaTraslado + tv + 5 deco + 1 ext": 5.25, "AltaTraslado + tv + 5 deco + 2 ext": 6,
        "AltaTraslado + tv + 5 deco + 3 ext": 6.75, "AltaTraslado + tv + 5 deco + 4 ext": 7.5,
        
        // === MODIFICACIONES ===
        "Modificaciones de Instalacion": 0.75,
        "Modificaciones \"1 Extensor Adicional\"": 0.75, "Modificaciones \"2 Extensor Adicional\"": 1.5,
        "Modificaciones \"3 Extensor Adicional\"": 2.25, "Modificaciones \"4 Extensor Adicional\"": 3,
        "Modificaciones \"1 Deco Adicional\"": 0.5, "Modificaciones \"2 Deco Adicional\"": 1,
        "Modificaciones \"3 Deco Adicional\"": 1.5, "Modificaciones \"4 Deco Adicional\"": 2,
        "Modificaciones \" 1 deco + 1 ext\"": 1.25, "Modificaciones \" 1 deco + 2 ext\"": 2,
        "Modificaciones \" 1 deco + 3 ext\"": 2.75, "Modificaciones \" 1 deco + 4 ext\"": 3.5,
        "Modificaciones \"2 deco + 1 ext\"": 1.75, "Modificaciones \"2 deco + 2 ext\"": 2.5,
        "Modificaciones \"2 deco + 3 ext\"": 3.25, "Modificaciones \"2 deco + 4 ext\"": 4,
        "Modificaciones  \"3 deco + 1 ext\"": 2.25, "Modificaciones  \"3 deco + 2 ext\"": 3,
        "Modificaciones  \"3 deco + 3 ext\"": 3.75, "Modificaciones  \"3 deco + 4 ext\"": 4.5,
        "Modificaciones \"4 deco + 1 ext\"": 4.75, "Modificaciones \"4 deco + 2 ext\"": 5.5,
        "Modificaciones \"4 deco + 3 ext\"": 6.25, "Modificaciones \"4 deco + 4 ext\"": 7,
        "Modificaciones \"5 deco + 1 ext\"": 3.25, "Modificaciones \"5 deco + 2 ext\"": 4,
        "Modificaciones \"5 deco + 3 ext\"": 4.75, "Modificaciones \"5 deco + 4 ext\"": 5.5,
        
        // === REPARACION ===
        "VT": 1
    },

    personal: {
        despacho: [],
        tecnicos: []
    },
    cargos: [],
    empleados: [],
    lnbs: [],
    articulos: {
        seriados: [],
        ferreteria: []
    },
    ingresosSeriados: [],
    ingresosTarjetas: []    
};
let motivoSeleccionado = null;
let ordenes = [];
let paginaActual = 1;
const filasPorPagina = 10;
const TIPOS_RECHAZO = ["Cliente rechaza", "Sin moradores", "Direccion erronea", "Orden mal generada", "Servicio operativo", "Sin Factibilidad"];
let datosReporteActual = [];
let timeoutBienvenida = null;
let asignacionesPendientes = [];  // Acumula todas las asignaciones de esta sesión
let guiaActual = null;             // Guía única para toda la sesión
let sesionActiva = false;          // Indica si hay una sesión de asignación en curso
let asignacionActiva = {           // Estado actual de la asignación
    tipo: null,
    materialCodigo: null,
    cantidad: 0,
    seriesIngresadas: [],
    tecnicoNombre: null,
    tecnicoId: null
};

// Definir qué módulos requiere cada panel
    const moduloPorPanel = {
        // RRHH
        'panel-gestion-cargos': 'rrhh',
        'panel-lista-personal': 'rrhh',
        'panel-nuevo-ingreso': 'rrhh',
        'panel-editar-empleado': 'rrhh',
        'panel-buscar-colaborador': 'rrhh',
        'panel-gestion-usuarios': 'rrhh',
        
        // ✅ INGRESO CLIENTES (NUEVO)
        'panel-ingreso-cliente': 'ingreso',
        
        //Despacho
        'panel-agendadas': 'dth',
        'panel-liquidadas': 'dth',
        'panel-rechazadas': 'dth',
        'panel-editar-orden': 'dth',
        'panel-buscar-orden': 'dth',
        'panel-buscar-rut': 'dth',
        'panel-buscar-serie': 'dth',
        
        // Logística
        'panel-gestion-equipos': 'logistica',
        'panel-ingreso-seriados': 'logistica',
        'panel-ingreso-no-seriados': 'logistica',
        'panel-eliminar-serie': 'logistica',
        'panel-gestion-bodega': 'logistica',
        'panel-saldo-tecnico': 'logistica',
        'panel-transferencia': 'logistica',
        'panel-asignacion-materiales': 'logistica',
        'panel-bodega-malos': 'logistica',
        'panel-bodega-reversa': 'logistica',

        // Dentro de appData:
        flota: [],
        panol: { herramientas: [], epp: [], uniformes: [] },

        // Dentro de moduloPorPanel:
        'panel-flota-km': 'flota',
        'panel-flota-prox-revision': 'flota',
        'panel-flota-actual': 'flota',
        'panel-panol-herramientas': 'panol',
        'panel-panol-epp': 'panol',
        'panel-panol-uniformes': 'panol',
        
        // Reportes / Avance
        'reportes-produccion': 'avance',
        
        // Gestion orden
        'panel-gestion-orden': 'gestion-orden',
        'panel-eliminar-orden': 'gestion-orden',
        'panel-reversar-orden': 'gestion-orden',
        'panel-eliminar-serie': 'gestion-orden',
        'panel-bitacora': 'gestion-orden'
    };

function filtrarPorFecha(ordenes, inicio, fin) {
    return ordenes.filter(o => {
        if (!o.fecha) return false;

        // Normalizar fecha (por si viene con hora)
        let fecha = o.fecha.includes("T") 
            ? o.fecha.split("T")[0] 
            : o.fecha;

        // Validaciones seguras
        if (inicio && inicio !== "" && fecha < inicio) return false;
        if (fin && fin !== "" && fecha > fin) return false;

        return true;
    });
}

function esFechaFutura(fechaStr) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fechaIngreso = new Date(anio, mes - 1, dia);
    fechaIngreso.setHours(0, 0, 0, 0);
    return fechaIngreso >= hoy;
}

function parseFechaLocal(fechaStr) {
    const [anio, mes, dia] = fechaStr.split('-');
    return new Date(anio, mes - 1, dia);
}

/**
 * Devuelve una clase CSS según la diferencia en días entre la fecha de la orden y hoy.
 * @param {string} fechaOrden - Fecha en formato 'YYYY-MM-DD'
 * @returns {string} - Nombre de la clase CSS
 */
function obtenerClasePorFecha(fechaOrden) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaOrd = new Date(fechaOrden);
    const diffTime = fechaOrd - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'orden-pasada';      // Fecha en el pasado
    if (diffDays === 0) return 'orden-hoy';      // Hoy
    if (diffDays === 1) return 'orden-manana';   // Mañana
    return 'orden-futuro';                       // Pasado mañana o más
}

// ═══════════════════════════════════════════════════
// --- OBTENER PUNTAJE DESDE SUPABASE ---
// ═══════════════════════════════════════════════════

async function obtenerPuntajeSubservicio(servicio, subservicio) {
    try {
        const { data, error } = await supabase
            .from('puntajes_servicios')
            .select('puntaje')
            .eq('servicio', servicio)
            .eq('subservicio', subservicio)
            .eq('activo', true)
            .maybeSingle();
        
        if (error || !data) {
            console.warn(`⚠️ Puntaje no encontrado: ${servicio} - ${subservicio}`);
            return 0;
        }
        
        return parseFloat(data.puntaje) || 0;
    } catch (err) {
        console.error('❌ Error al obtener puntaje:', err);
        return 0;
    }
}

/**
 * Obtiene el puntaje de un subservicio específico
 * @param {string} subservicio - Nombre del subservicio
 * @returns {number} - Puntaje correspondiente (0 si no se encuentra)
 */
function obtenerPuntajeSubservicio(subservicio) {
    if (!subservicio || !appData.puntajesServicios) return 0;
    const puntaje = appData.puntajesServicios[subservicio];
    return puntaje !== undefined ? puntaje : 0;
}

function generarSufijoPorRegion(regionId) {
    return regionId === "14" ? "-R" : "-L";
}

function esCargoTecnico(nombre) {
    if (!nombre) return false;
    const normalizado = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizado.includes('tecnico');
}

function normalizarSerie(serie) {
    if (!serie) return '';
    return serie.toString().trim().replace(/\s+/g, '');
}

function normalizarRut(rut) {
    if (!rut) return '';
    return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

async function registrarBitacora(tipoMovimiento, descripcion, detalle = '', extras = {}) {
    try {
        const usuario = window.usuarioActivo?.nombre || 'Sistema';
        
        const registro = {
            tipo: tipoMovimiento,
            serie: descripcion,
            codigo_articulo: detalle,
            usuario: usuario,
            fecha_eliminacion: new Date().toISOString(),
            observacion: tipoMovimiento,
            detalles: extras
        };
        
        const { error } = await supabase.from('bitacora').insert([registro]);
        
        if (error) {
            console.error('❌ Error al registrar bitácora:', error);
        } else {
            console.log('✅ Bitácora registrada:', tipoMovimiento);
        }
    } catch (err) {
        console.error('❌ Error en registrarBitacora:', err);
    }
}

// =======================================================
// --- Funciones de UI (Interfaz de Usuario) ---
// =======================================================
function mostrarToast(mensaje, tipo = 'success') {
    const contenedor = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    contenedor.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}
// ==================================
// --- Lógica de Login y Navegación ---
// ==================================
function login() {
    const rutInput = document.getElementById('login-rut')?.value.trim();
    const pass = document.getElementById('login-pass')?.value;
    
    // 1. Validación básica
    if (!rutInput || !pass) {
        return mostrarToast("RUT y contraseña son obligatorios.", "error");
    }

    // 2. Normalizamos RUT
    const rutLimpio = normalizarRut(rutInput);

    // 3. Buscamos usuario
    const usuario = appData.usuarios?.find(u => {
        return normalizarRut(u.rut) === rutLimpio &&
                (u.pass === pass || u.password === pass) &&
                u.activo !== false;
    });

    if (!usuario) {
        const existePeroInactivo = appData.usuarios?.some(u =>
            normalizarRut(u.rut) === rutLimpio && u.activo === false
        );
        if (existePeroInactivo) {
            return mostrarToast("🔒 Esta cuenta está desactivada. Contacte a RRHH.", "error");
        }
        return mostrarToast("RUT o contraseña incorrectos.", "error");
    }

    // ✅ Autenticación exitosa
    window.usuarioActivo = usuario;
    sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));

    // 4. Reset de la Interfaz
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');

    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';

    // Limpiar menús activos anteriores
    document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));

    // 5. Filtrar módulos según el rol
    filtrarModulosPorRol(usuario.rol, 'modulo-bienvenida');

    // 6. Mostrar Panel de Bienvenida O redirigir si es técnico
    const rolUsuario = usuario.rol?.toLowerCase() || '';
    const esTecnico = rolUsuario.includes('tecnico') || rolUsuario.includes('técnico');

    if (esTecnico) {
        // TÉCNICO: marcar el módulo ingreso como activo visualmente, pero mostrar bienvenida
        document.querySelectorAll('#main-nav button').forEach(b => {
            b.classList.remove('active');
            if (b.dataset.module === 'ingreso') b.classList.add('active');
        });
        document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));
        mostrarToast(`Bienvenido, ${usuario.nombre}`, "success");
        mostrarPanel('modulo-bienvenida');
    } else {
        // OTROS ROLES: Mostrar bienvenida normal
        mostrarToast(`Bienvenido, ${usuario.nombre}`, "success");
        mostrarPanel('modulo-bienvenida');
    }
}

function filtrarModulosPorRol(rol, panelIdActual = null) {
    const permisos = {
        'admin': ['ingreso', 'dth', 'rrhh', 'gestion-orden', 'avance', 'logistica'],
        'rrhh': ['rrhh'],
        'despacho N1': ['ingreso', 'dth'],
        'despacho N2': ['ingreso', 'dth', 'logistica'],
        'logistica': ['logistica'],
        'lector': ['dth', 'logistica', 'avance']
    };
    
    const modulosPermitidos = permisos[rol] || [];
    
    // ✅ FIX: Usar panelIdActual o buscar el panel activo
    const panelId = panelIdActual || document.querySelector('#main-content .content-panel.active')?.id || 'modulo-bienvenida';
    const moduloRequerido = moduloPorPanel[panelId];
    
    if (moduloRequerido && !modulosPermitidos.includes(moduloRequerido)) {
        mostrarToast("⚠️ No tienes permisos para acceder a esta sección.", "error");
        return false;
    }
    
    // Filtrar menú horizontal
    document.querySelectorAll('#main-nav button[data-module]').forEach(btn => {
        const modulo = btn.dataset.module;
        if (modulosPermitidos.includes(modulo)) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
            btn.classList.remove('active');
        }
    });

    // Solo marcar visualmente el primer botón visible, SIN navegar
    const primerBotonVisible = document.querySelector('#main-nav button[data-module]:not([style*="display: none"])');
    if (primerBotonVisible) {
        document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
        primerBotonVisible.classList.add('active');
    }
    
    return true;
}


function seleccionarModulo(moduloId) {
    if (timeoutBienvenida) {
        clearTimeout(timeoutBienvenida);
        timeoutBienvenida = null;
    }
    document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
    const botonActivo = document.querySelector(`#main-nav button[data-module="${moduloId}"]`);
    if (botonActivo) botonActivo.classList.add('active');

    // Controlar visibilidad del sidebar en móvil según módulo
    if (moduloId === 'ingreso') {
        document.body.classList.add('modulo-ingreso');
    } else {
        document.body.classList.remove('modulo-ingreso');
    }

    // ✅ Ingreso Clientes: sin sidebar, va directo al formulario
    if (moduloId === 'ingreso') {
        document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));
        mostrarPanel('panel-ingreso-cliente');
        return;
    }

    document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));
    const submenuActivo = document.getElementById(`submenu-${moduloId}`);
    if (submenuActivo) submenuActivo.classList.add('active');
    mostrarPanel('modulo-bienvenida');
}

function mostrarPanel(panelId) {
    const usuario = window.usuarioActivo;
    // ✅ VALIDAR ROL LECTOR - SOLO LECTURA
    if (usuario?.rol === 'lector') {
        const panelesBloqueados = [
            'panel-ingreso-cliente',
            'panel-asignacion-materiales',
            'panel-transferencia',
            'panel-ingreso-seriados',
            'panel-ingreso-no-seriados',
            'panel-ingreso-lnb',
            'panel-gestion-equipos',
            'panel-eliminar-orden',
            'panel-reversar-orden',
            'panel-eliminar-serie',
            'panel-devolucion-equipos'
        ];
        
        cerrarSidebarSiEsMovil();

        if (panelesBloqueados.includes(panelId)) {
            mostrarToast("⛔ Rol 'Lector' solo tiene permisos de lectura.", "error");
            return;
        }
    }

    // Verificar si hay sesión activa
    if (!usuario) {
        mostrarToast("🔒 Debe iniciar sesión para acceder.", "error");
        return;
    }

    // ✅ OCULTAR PANEL DE REVERSAR ORDEN AL CAMBIAR DE MENÚ
    const panelReversarDespacho = document.getElementById('panel-reversar-orden-despacho');
    if (panelReversarDespacho) {
        panelReversarDespacho.style.display = 'none';
    }

    document.querySelectorAll('#main-content .content-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const moduloRequerido = moduloPorPanel[panelId];
    if (moduloRequerido) {
        // Solo verificar permisos, sin redirigir ni llamar seleccionarModulo
        const permisos = {
            'admin':        ['ingreso', 'dth', 'rrhh', 'gestion-orden', 'avance', 'logistica'],
            'rrhh':         ['rrhh'],
            'despacho N1':  ['ingreso', 'dth'],
            'despacho N2':  ['ingreso', 'dth', 'logistica'],
            'logistica':    ['logistica'],
            'lector':       ['dth', 'logistica', 'avance']
        };
        const rol = usuario?.rol || 'admin';
        const modulosPermitidos = permisos[rol] || [];
        if (!modulosPermitidos.includes(moduloRequerido)) {
            mostrarToast("⚠️ No tienes permisos para acceder a esta sección.", "error");
            return;
        }

        // Activar el módulo correcto en el menú superior
        document.querySelectorAll('#main-nav button').forEach(b => {
            b.classList.remove('active');
            if (b.dataset.module === moduloRequerido) b.classList.add('active');
        });
        
        // Activar el submenu correcto en la barra lateral (excepto ingreso que no tiene submenu)
        document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));
        if (moduloRequerido !== 'ingreso') {
            const submenuActivo = document.getElementById(`submenu-${moduloRequerido}`);
            if (submenuActivo) submenuActivo.classList.add('active');
        }
    }

    // ✅ Mostrar el panel solicitado
    document.querySelectorAll('#main-content .content-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const panelActivo = document.getElementById(panelId);
    if (!panelActivo) {
        console.error(`Panel no encontrado: ${panelId}`);
        return;
    }

    panelActivo.classList.add('active');
    panelActivo.style.display = 'block';

    if (panelId === 'modulo-bienvenida' && usuario) {
        const nombreEl = document.getElementById('usuario-activo-nombre');
        const rolEl = document.getElementById('usuario-activo-rol');
        if (nombreEl) nombreEl.textContent = usuario.nombre;
        if (rolEl) rolEl.textContent = usuario.rol;
    }

    // Ejecutar lógica específica según el panel
    switch (panelId) {
        case 'panel-ingreso-cliente':
            resetFormularioOrden();
            break;
        case 'panel-devolucion-equipos':
        inicializarPanelDevolucion();
        break;
        case 'panel-cumpleanos':
            inicializarPanelCumpleanos();
            break;
        case 'panel-vencimiento-licencias':
            inicializarPanelVencimientoLicencias();
            break;
        case 'modulo-bienvenida':
            const moduloActivo = document.querySelector('#main-nav button.active')?.dataset.module;
            if (moduloActivo) {
                const imagenModulo = document.getElementById('imagen-modulo');
                const tituloModulo = document.getElementById('titulo-modulo');
                let imgSrc = '';
                let titulo = '';
                switch (moduloActivo) {
                    case 'ingreso':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Ingreso de Clientes';
                        break;
                    case 'dth':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Operaciones de Terreno';
                        break;
                    case 'rrhh':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Recursos Humanos';
                        break;
                    case 'avance':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Reportes y Análisis';
                        break;
                    case 'logistica':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Gestión Logística';
                        break;
                    case 'gestion-orden':
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                        titulo = 'Gestión de ticket';                      
                        break;
                    default:                        
                        titulo = 'Bienvenido a Tu Empresa';
                        imgSrc = 'https://i.imgur.com/kHjXN3M.jpeg';
                }
                if (imagenModulo) {
                    imagenModulo.src = 'https://i.imgur.com/kHjXN3M.jpeg';
                    imagenModulo.style.opacity = '1';
                }
                if (tituloModulo) {
                    tituloModulo.textContent = titulo;
                    tituloModulo.style.opacity = '1';
                }
            }
            break;

        case 'panel-despacho':
        // ✅ MOSTRAR/Ocultar panel de reversar orden según el rol
        const panelReversarDespacho = document.getElementById('panel-reversar-orden-despacho');
        if (panelReversarDespacho) {
            if (usuario.rol === 'despacho N2') {
                panelReversarDespacho.style.display = 'block';
            } else {
                panelReversarDespacho.style.display = 'none';
            }
        }
        break;

        case 'panel-agendadas':
            paginaActual = 1;
            if (appData.personal.tecnicos.length > 0) {
                populateSelect(document.getElementById('filtro-tecnico'), appData.personal.tecnicos.map(t => ({ value: t, text: t })), "Todos los Técnicos");
            }
            if (Object.keys(appData.servicios).length > 0) {
                populateSelect(document.getElementById('filtro-servicio'), Object.keys(appData.servicios).map(s => ({ value: s, text: s })), "Todos los Servicios");
            }
            const regionFiltroEl = document.getElementById("filtro-region");
            if (regionFiltroEl) {
                populateSelect(regionFiltroEl, Object.keys(appData.regiones).map(num => ({ value: num, text: appData.regiones[num].nombre })), "Todas las Regiones");
                // ✅ FIX: Clonar para eliminar listeners duplicados acumulados
                const regionFiltroNuevo = regionFiltroEl.cloneNode(true);
                regionFiltroEl.parentNode.replaceChild(regionFiltroNuevo, regionFiltroEl);
                regionFiltroNuevo.addEventListener('change', () => {
                    cargarComunas(document.getElementById('filtro-comuna'), regionFiltroNuevo);
                    aplicarFiltros();
                });
                cargarComunas(document.getElementById('filtro-comuna'), regionFiltroNuevo);
            }

            const comunaFiltroEl = document.getElementById('filtro-comuna');
            if (comunaFiltroEl) {
                // ✅ FIX: Clonar también el de comuna para evitar duplicados
                const comunaFiltroNuevo = comunaFiltroEl.cloneNode(true);
                comunaFiltroEl.parentNode.replaceChild(comunaFiltroNuevo, comunaFiltroEl);
                comunaFiltroNuevo.addEventListener('change', aplicarFiltros);
            }

            const filtrosContainer = document.querySelector('#panel-agendadas .filtros-container');
            if (filtrosContainer) filtrosContainer.style.display = 'flex';
            aplicarFiltros();
            break;

        case 'panel-gestion-cargos': renderGestionCargos(); break;
        case 'panel-lista-personal': renderTablaPersonal(); break;
        case 'panel-nuevo-ingreso': setupFormularioNuevoIngreso(); break;
        case 'panel-liquidadas':
            const inicioLiq = document.getElementById('filtro-liquida-inicio');
            const finLiq = document.getElementById('filtro-liquida-fin');
            if (inicioLiq) inicioLiq.value = '';
            if (finLiq) finLiq.value = '';
            renderTablaLiquidadas();
            break;

        case 'panel-rechazadas':
            const inicioRech = document.getElementById('filtro-rechazo-inicio');
            const finRech = document.getElementById('filtro-rechazo-fin');
            if (inicioRech) inicioRech.value = '';
            if (finRech) finRech.value = '';
            renderTablaRechazadas();
            break;

        case 'reportes-produccion': 
            poblarFiltrosReporte();
            // ✅ NO llamar a aplicarFiltrosReporte() automáticamente
            // El usuario debe seleccionar filtros y hacer clic en "Generar Reporte"
            break;

        case 'panel-buscar-colaborador':
            document.getElementById('buscar-colab-input').value = '';
            document.getElementById('resultado-busqueda-colab').innerHTML = '';
            break;

        case 'panel-gestion-bodega': calcularSaldoBodega(); break;
        case 'panel-saldo-tecnico': setupSaldoTecnico(); break;

        case 'panel-transferencia': 
            const tecOrigen = document.getElementById('tec-origen');
            const tecDestino = document.getElementById('tec-destino');
            if (tecOrigen && tecDestino) {
                cargarTecnicosTransferencia();
                tecOrigen.addEventListener('change', function () {
                    const id = this.value;
                    if (id) {
                        document.getElementById('stock-origen').style.display = 'block';
                        mostrarStockOrigen(id);
                    } else {
                        document.getElementById('stock-origen').style.display = 'none';
                        document.getElementById('contenedor-destino').style.display = 'none';
                        document.getElementById('btn-transferir').style.display = 'none';
                        document.getElementById('lista-materiales-origen').innerHTML = '';
                    }
                });
                const btnTransferir = document.getElementById('btn-transferir');
                if (btnTransferir) {
                    const nuevoBtn = btnTransferir.cloneNode(true);
                    btnTransferir.parentNode.replaceChild(nuevoBtn, btnTransferir);
                    document.getElementById('btn-transferir').addEventListener('click', transferirMateriales);
                }
            }
            break;

        case 'panel-bodega-malos': renderBodegaMalos(); break;
        case 'panel-bodega-reversa': renderBodegaReversa(); break;
        case 'panel-gestion-equipos': renderGestionEquipos(); break;
        case 'panel-gestion-bodega-malo': renderGestionBodegaMalo(); break;
        case 'panel-gestion-usuarios': renderListaUsuarios(); break;
        case 'panel-asignacion-materiales':
            setTimeout(() => {
                try { inicializarAsignacion(); } 
                catch (err) {
                    console.error("❌ Error al inicializar asignación:", err);
                    mostrarToast("Error al cargar el panel de asignación.", "error");
                }
            }, 150);
            break;

        case 'panel-ingreso-lnb':
            cargarArticulosLNB();
            break;

        // ✅ LIMPIEZA AUTOMÁTICA AL ENTRAR A BÚSQUEDAS
        case 'panel-buscar-orden':
            document.getElementById('buscar-orden-input').value = '';
            document.getElementById('resultado-orden').innerHTML = '';
            break;

        case 'panel-buscar-rut':
            document.getElementById('buscar-rut-input').value = '';
            document.getElementById('resultado-rut').innerHTML = '';
            break;

        case 'panel-buscar-serie':
            document.getElementById('input-buscar-serie').value = '';
            document.getElementById('resultado-busqueda-serie').innerHTML = '';
            break;

        case 'panel-bitacora':
            renderBitacora();
            break;

        case 'panel-eliminar-orden':
        case 'panel-reversar-orden':
        case 'panel-eliminar-serie':
            // Limpiar inputs al entrar
            ['eliminar-orden-numero', 'reversar-orden-numero', 'eliminar-serie-input'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const resEl = document.getElementById('resultado-eliminar-serie');
            if (resEl) resEl.innerHTML = '';
            break;
    }
}

// ═══════════════════════════════════════════════════
// --- CARGAR SERVICIOS EN EL SELECT ---
// ═══════════════════════════════════════════════════
function cargarServiciosEnSelect() {
    const servicioSelect = document.getElementById('orden-servicio');
    if (!servicioSelect || !appData.servicios) return;
    
    // Limpiar opciones (mantener solo la primera)
    servicioSelect.innerHTML = '<option value="">-- Seleccione Servicio --</option>';
    
    // Agregar cada servicio desde appData
    Object.keys(appData.servicios).forEach(servicio => {
        const opt = document.createElement('option');
        opt.value = servicio;
        opt.textContent = servicio;
        servicioSelect.appendChild(opt);
    });
    
    console.log(`✅ ${Object.keys(appData.servicios).length} servicios cargados en el select`);
}

/**
 * Valida el RUT chileno (algoritmo oficial)
 * @param {string} rutCompleto - RUT con formato XXXXXXXX-X
 * @returns {boolean}
 */
function validarRutChileno(rutCompleto) {
    if (!rutCompleto) return false;
    
    // Limpiar: quitar puntos y espacios, mantener guión
    const rutLimpio = rutCompleto.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
    
    // Validar formato mínimo: cuerpo numérico + guión + DV
    if (!/^\d+-[\dK]$/.test(rutLimpio)) return false;
    
    const [cuerpo, dvIngresado] = rutLimpio.split('-');
    if (!cuerpo || !dvIngresado) return false;
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const dvCalculado = 11 - (suma % 11);
    const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
    
    return dvIngresado === dvEsperado;
}

function cargarComunas(selectComuna, selectRegion) {
    if (!selectComuna || !selectRegion) return;
    const regionNum = selectRegion.value; 
    const comunas = appData.regiones[regionNum]?.comunas || [];
    populateSelect(selectComuna, comunas.map(c => ({ value: c, text: c })), "Seleccione Comuna");
}

function cargarSubServicio(selectSub, selectServicio) {
    if (!selectSub || !selectServicio) return;
    const servicio = selectServicio.value;
    const subServicios = appData.servicios[servicio] || [];
    populateSelect(selectSub, subServicios.map(s => ({ value: s, text: s })), "Seleccione Sub Servicio");
}

function resetFormularioOrden() {
    const tituloIngreso = document.getElementById('titulo-ingreso-orden');
    if (tituloIngreso) {
        tituloIngreso.textContent = 'Ingreso Orden';
    }
    
    const form = document.getElementById('form-ingreso-orden');
    if (form) {
        form.reset();
        form.style.display = 'block';
    }

    // Cargar servicios en el select
    cargarServiciosEnSelect();

    const numInput = document.getElementById('orden-numero');
    if (numInput) {
        numInput.value = '';
        numInput.disabled = false;
    }

    // Región oculta pero con valor "13" (Metropolitana)
    const regionSelect = document.getElementById('orden-region');
    if (regionSelect) {
        regionSelect.value = '13';
        regionSelect.closest('.form-group')?.style.setProperty('display', 'none', 'important');
    }

    // Comuna se carga automáticamente para RM
    const comunaSelect = document.getElementById('orden-comuna');
    if (comunaSelect) {
        const comunasRM = appData.regiones["13"]?.comunas || [];
        comunaSelect.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
        comunasRM.forEach(comuna => {
            const opt = document.createElement('option');
            opt.value = comuna;
            opt.textContent = comuna;
            comunaSelect.appendChild(opt);
        });
    }

    // Subservicio limpio
    const subServicioSelect = document.getElementById('orden-sub');
    if (subServicioSelect) {
        subServicioSelect.innerHTML = '<option value="">-- Seleccione Subservicio --</option>';
    }

    // ✅ TÉCNICO AUTO-ASIGNADO (usuario logueado)
    const tecnicoSelect = document.getElementById('orden-tecnico');
    if (tecnicoSelect && window.usuarioActivo) {
        const nombreUsuario = window.usuarioActivo.nombre;
        tecnicoSelect.value = nombreUsuario;
        tecnicoSelect.disabled = true; // 🔒 Bloqueado para que no lo cambien
    }

    // ❌ ELIMINAR CAMPO DESPACHO del formulario
    const despachoSelect = document.getElementById('orden-despacho');
    if (despachoSelect) {
        despachoSelect.closest('.form-group')?.style.setProperty('display', 'none', 'important');
    }

    // RUT limpio
    const rutInput = document.getElementById('orden-rut');
    if (rutInput) {
        rutInput.classList.remove('valid', 'invalid');
    }
    
    // ❌ LIMPIAR CAMPOS ELIMINADOS
    ['coordenadas', 'ferreteria-lnb', 'ferreteria-antena'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            el.closest('.form-group')?.style.setProperty('display', 'none', 'important');
        }
    });
    // ✅ AUTO-ASIGNAR TÉCNICO (usuario logueado)
    if (window.usuarioActivo) {
        const tecnicoInput = document.getElementById('orden-tecnico');
        if (tecnicoInput) {
            tecnicoInput.value = window.usuarioActivo.nombre;
            // Opcional: bloquear para que no lo cambien
            // tecnicoInput.disabled = true;
        }
    }
}


async function guardarOrden(event) {
    event.preventDefault();
    
    const numero = document.getElementById('orden-numero')?.value.trim();
    const rutIngresado = document.getElementById('orden-rut')?.value.trim();
    
    if (!rutIngresado) {
        return mostrarToast("El RUT es obligatorio.", "error");
    }
    
    if (!validarRutChileno(rutIngresado)) {
        document.getElementById('orden-rut')?.classList.add('invalid');
        return mostrarToast("❌ RUT inválido. Verifique el formato y dígito verificador.", "error");
    }
    
    const nombre = document.getElementById('orden-nombre')?.value.trim();
    const direccion = document.getElementById('orden-direccion')?.value.trim();
    const numero_contacto = document.getElementById('numero_contacto')?.value.trim();
    
    // ✅ NUEVOS CAMPOS: Persona que recibe y su teléfono
    const nombreRecibe = document.getElementById('orden-nombre-recibe')?.value.trim() || '';
    const telefonoRecibe = document.getElementById('orden-telefono-recibe')?.value.trim() || '';
    
    const regionId = '13';
    const regionNombre = 'Región Metropolitana';
    const comuna = document.getElementById('orden-comuna')?.value;
    const servicio = document.getElementById('orden-servicio')?.value;
    const subServicio = document.getElementById('orden-sub')?.value;
    const fecha = document.getElementById('orden-fecha')?.value;
    
    // ✅ TÉCNICO AUTO-ASIGNADO (del usuario logueado)
    let tecnico = '';
    if (window.usuarioActivo) {
        tecnico = window.usuarioActivo.nombre;
    }
    
    // ❌ DESPACHO: Se deja null/vacío para que lo asigne quien valide
    const despacho = null; // o '' 
    
    const observacion = document.getElementById('orden-observacion')?.value.trim();
    
    // ✅ CAMPOS DE FERRETERÍA (sin LNB ni Antena)
    const ferreteria = {
        conectores: document.getElementById('ferreteria-conectores')?.value || '0',
        cable: document.getElementById('ferreteria-cable')?.value || '0',
        modem: document.getElementById('ferreteria-modem')?.value || '', // ✅ CAMBIADO de "tarjeta" a "modem"
        // ❌ ELIMINADOS: lnb, antena
    };
    
    if (!numero || !rutIngresado || !nombre || !direccion || !regionId || !comuna || !servicio || !subServicio || !fecha) {
        return mostrarToast("Todos los campos marcados son obligatorios.", "error");
    }

    if (!validarRutChileno(rutIngresado)) {
        return mostrarToast("RUT inválido.", "error");
    }

    const rut = normalizarRut(rutIngresado);

    if (!esFechaFutura(fecha)) {
        return mostrarToast("La fecha de ingreso debe ser hoy o futura.", "error");
    }

    const puntaje = obtenerPuntajeSubservicio(subServicio);
    
    const nuevaOrden = {
        numero,
        rut_cliente: rut,
        nombre_cliente: nombre,
        numero_contacto: numero_contacto,
        direccion,
        comuna,
        servicio,
        subservicio: subServicio,
        fecha,
        tecnico, // ✅ Auto-asignado
        despacho, // ❌ Null para asignar después
        observacion,
        estado: 'Agendada',
        region: regionNombre,
        // ✅ NUEVOS CAMPOS
        nombre_recibe: nombreRecibe,
        telefono_recibe: telefonoRecibe,
        ferreteria: ferreteria,
        // ❌ SIN coordenadas
    };
    
    console.log("📦 Enviando a Supabase:", {
        ...nuevaOrden,
        numero_contacto: numero_contacto
    });

    try {
        // Verificar si la orden ya existe
        const { data: existente } = await supabase
            .from('ordenes')
            .select('id, numero, estado')
            .eq('numero', numero)
            .maybeSingle();

        if (existente) {
            console.warn(`⚠️ Orden duplicada detectada:`, existente);
            return mostrarToast(`La orden ${numero} ya existe en el sistema (estado: ${existente.estado}).`, "error");
        }

        const { data, error } = await supabase
            .from('ordenes')
            .insert([nuevaOrden])
            .select();

        if (error) throw error;

        const ordenGuardada = data[0];
        ordenes.unshift(ordenGuardada);

        mostrarToast(`Orden N° ${numero} guardada con éxito.`, "success");
        resetFormularioOrden();
        mostrarPanel('panel-agendadas');
        
    } catch (err) {
        console.error("❌ Error al guardar en Supabase:", err);
        const mensajeError = err?.message || err?.details || JSON.stringify(err);
        mostrarToast(`Error al guardar: ${mensajeError}`, "error");
    }
}

function esUsuarioTecnico(usuario) {
    if (!usuario) return false;
    const rol = (usuario.rol || '').toLowerCase();
    return rol.includes('tecnico') || rol.includes('técnico');
}

// === FUNCIÓN 2: Para formatear RUT ya normalizado para visualización ===
function formatearRutParaVisualizacion(rutNormalizado) {
    if (!rutNormalizado) return '—';
    if (rutNormalizado.length < 2) return rutNormalizado;
    
    const cuerpo = rutNormalizado.slice(0, -1);
    const dv = rutNormalizado.slice(-1).toUpperCase();
    return `${cuerpo}-${dv}`; // Formato: 12345678-9
}

function abrirEdicionOrden(ordenId) {
    // ✅ VALIDAR ROL LECTOR - NO PUEDE EDITAR
    if (window.usuarioActivo?.rol === 'lector') {
        mostrarToast("⛔ Rol 'Lector' no puede editar órdenes.", "error");
        return;
    }

    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) {
        mostrarToast("Error: No se encontró la orden.", "error");
        return;
    }

    // === 1. Título con número de orden ===
    const tituloElement = document.getElementById('titulo-editar-orden');
    if (tituloElement) {
        tituloElement.textContent = `Editar Orden ${orden.numero}`;
    }

    // === 2. Rellenar campos de texto ===
    safeSetInputValue('editar-orden-id', orden.id);
    
    // CORRECCIÓN TELÉFONO: Usamos ambas variantes por seguridad
    safeSetInputValue('editar-numeroContacto', orden.numero_contacto || orden.telefonoContacto || ''); 
    safeSetInputValue('editar-orden-rut', formatearRutParaVisualizacion(orden.rut_cliente || orden.rut || ''));
    safeSetInputValue('editar-orden-nombre', orden.nombre_cliente || orden.nombre || '');
    safeSetInputValue('editar-orden-direccion', orden.direccion || '');
    safeSetInputValue('editar-orden-fecha', orden.fecha || '');

    // === 3. Cargar y seleccionar Comuna ===
    const comunaSelect = document.getElementById('editar-orden-comuna');
    if (comunaSelect) {
        const regionKey = Object.keys(appData.regiones).find(key => appData.regiones[key].nombre === orden.region);
        if (regionKey) {
            cargarComunas(comunaSelect, { value: regionKey });
            comunaSelect.value = orden.comuna || '';
        } else {
            comunaSelect.innerHTML = '<option value="">-- Seleccione Región primero --</option>';
        }
    }

    // === 4. Cargar y seleccionar Servicio ===
    const servicioSelect = document.getElementById('editar-orden-servicio');
    if (servicioSelect) {
        populateSelect(servicioSelect, Object.keys(appData.servicios || {}).map(s => ({
            value: s,
            text: s
        })), "Seleccione Servicio");
        servicioSelect.value = orden.servicio || '';

        servicioSelect.onchange = () => {
            cargarSubServicio(document.getElementById('editar-orden-sub'), servicioSelect);
        };
        // Cargar subservicios
        cargarSubServicio(document.getElementById('editar-orden-sub'), servicioSelect);
        document.getElementById('editar-orden-sub').value = orden.subServicio || orden.subservicio || ''; 
    }

    // === 5. Cargar y seleccionar Técnico ===
    const tecnicoSelect = document.getElementById('editar-orden-tecnico');
    if (tecnicoSelect) {
        const tecnicos = appData.empleados.filter(emp => 
            emp.activo && appData.cargos.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre))
        ).map(emp => ({
            value: `${emp.nombre1} ${emp.apepaterno}`, 
            text: `${emp.nombre1} ${emp.apepaterno}`
        }));
        
        populateSelect(tecnicoSelect, [{ value: '', text: '-- Seleccione Técnico --' }, ...tecnicos]);
        tecnicoSelect.value = orden.tecnico || ''; 
    }

    // === 6. Cargar y seleccionar Despacho ===
    const despachoSelect = document.getElementById('editar-orden-despacho');
    if (despachoSelect) {
        const despachos = appData.empleados.filter(emp => 
            emp.activo && (emp.cargoId === 'cargo-despacho' || appData.cargos.find(c=>c.id === emp.cargoId)?.nombre.toLowerCase().includes('despacho'))
        ).map(emp => ({
            value: `${emp.nombre1} ${emp.apepaterno}`, 
            text: `${emp.nombre1} ${emp.apepaterno}`
        }));

        populateSelect(despachoSelect, [{ value: '', text: '-- Seleccione Despacho --' }, ...despachos]);
        despachoSelect.value = orden.despacho || '';
    }

    // === 7. Cargar Observaciones ===
    safeSetInputValue('editar-orden-observacion', orden.observacion || '');

    // === Mostrar panel ===
    mostrarPanel('panel-editar-orden');
}

// Función auxiliar para evitar errores de "null"
function safeSetInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

async function guardarEdicionOrden(event) {
    if (event) event.preventDefault();
    
    // 1. Obtener el ID de la orden que estamos editando
    const id = document.getElementById('editar-orden-id')?.value;
    if (!id) {
        mostrarToast("Error: No se pudo identificar la orden.", "error");
        return;
    }

    // 2. Recuperar la orden original de la memoria para no perder datos (como el número)
    const ordenOriginal = ordenes.find(o => o.id === id);
    if (!ordenOriginal) {
        mostrarToast("Error: Orden no encontrada en el sistema.", "error");
        return;
    }

    // 3. Capturar los valores de los inputs del formulario
    const rutIngresado = document.getElementById('editar-orden-rut')?.value.trim();
    const nombre = document.getElementById('editar-orden-nombre')?.value.trim();
    const direccion = document.getElementById('editar-orden-direccion')?.value.trim();
    const numero_contacto = document.getElementById('editar-numeroContacto')?.value.trim(); 
    const comuna = document.getElementById('editar-orden-comuna')?.value;
    const servicio = document.getElementById('editar-orden-servicio')?.value;
    const subServicio = document.getElementById('editar-orden-sub')?.value;
    const fecha = document.getElementById('editar-orden-fecha')?.value;
    const tecnico = document.getElementById('editar-orden-tecnico')?.value;
    const despacho = document.getElementById('editar-orden-despacho')?.value;
    const observacion = document.getElementById('editar-orden-observacion')?.value.trim();

    // 4. Validación de campos obligatorios
    if (!rutIngresado || !nombre || !direccion || !comuna || !servicio || !subServicio || !fecha || !despacho) {
        mostrarToast("Por favor, complete todos los campos obligatorios (el Técnico es opcional).", "error");
        return;
    }

    // 5. Validar RUT
    if (!validarRutChileno(rutIngresado)) {
        mostrarToast("El RUT ingresado no es válido.", "error");
        return;
    }
    const rutNormalizado = normalizarRut(rutIngresado);

    // 6. Calcular la Región automáticamente basándonos en la Comuna
    let regionNombre = ordenOriginal.region; 
    for (const [key, data] of Object.entries(appData.regiones)) {
        if (data.comunas.includes(comuna)) {
            regionNombre = data.nombre;
            break;
        }
    }

    // 7. Preparar el objeto con los datos actualizados
    const datosActualizados = {
        rut_cliente: rutNormalizado,
        nombre_cliente: nombre,
        numero_contacto: numero_contacto,
        direccion: direccion,
        comuna: comuna,
        region: regionNombre,
        servicio: servicio,
        subservicio: subServicio,
        fecha: fecha,
        tecnico: tecnico,
        despacho: despacho,
        observacion: observacion
    };

    try {
        // 8. Actualizar en Supabase
        const { error } = await supabase
            .from('ordenes')
            .update(datosActualizados)
            .eq('id', id);

        if (error) throw error;

        // 9. Actualizar en la memoria local (array ordenes) para que el cambio se vea de inmediato
        const index = ordenes.findIndex(o => o.id === id);
        if (index !== -1) {
            ordenes[index] = { 
                ...ordenes[index], 
                ...datosActualizados,
                rut: rutNormalizado,
                nombre: nombre
            };
        }

        mostrarToast("✅ Orden actualizada correctamente.", "success");
        
        // 10. Cerrar panel y refrescar vista
        mostrarPanel('panel-agendadas');
        if (typeof aplicarFiltros === 'function') aplicarFiltros();

    } catch (err) {
        console.error("Error al guardar en Supabase:", err);
        mostrarToast("Error al guardar los cambios en la base de datos.", "error");
    }
}

// ============================================
// --- Lógica del Panel "Agendadas" y Filtros ---
// ============================================
function renderTablaAgendadas(datos) {
    const tbody = document.querySelector("#tabla-agendadas tbody");
    if (!tbody) return;
    if (!datos || datos.length === 0) {
        paginaActual = 1;
    }
    const datosParaMostrar = datos || ordenes.filter(o => o.estado === 'Agendada');
    tbody.innerHTML = "";
    if (datosParaMostrar.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No se encontraron órdenes agendadas.</td></tr>`;
        const paginacion = document.getElementById("paginacion");
        if (paginacion) paginacion.innerHTML = "";
        return;
    }
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const datosPaginados = datosParaMostrar.slice(inicio, fin);

    datosPaginados.forEach(o => {
        const tr = document.createElement("tr");
        tr.className = obtenerClasePorFecha(o.fecha);
        tr.innerHTML = `
        <td style="text-align:center; width:36px;">
            <input type="checkbox" class="chk-orden" data-numero="${o.numero}" title="Seleccionar orden">
        </td>
        <td><button class="btn-link-orden" data-id="${o.id}">${o.numero}</button></td>
        <td>${o.fecha}</td>
        <td>${o.subservicio}</td>
        <td>${o.nombre_cliente}</td>
        <td>${o.rut_cliente}</td>
        <td>${o.direccion}</td>
        <td>${o.comuna}</td>
        <td>${o.tecnico}</td>
        <td>${o.observacion || '—'}</td>
        <td style="position: relative;">
            <div class="dropdown-despacho" data-orden-id="${o.id}">
                <button class="btn-estado-despacho" onclick="toggleDropdownDespacho(event, '${o.id}')">
                    🔄 Estado
                </button>
                <div class="dropdown-content-despacho" id="dropdown-${o.id}" style="display: none;">
                    <button class="btn-liquidar" data-id="${o.id}" onclick="abrirModalLiquidacion('${o.id}')">
                        ✅ Liquidar
                    </button>
                    <button class="btn-rechazar" data-id="${o.id}" onclick="abrirMotivoRechazo('${o.id}')">
                        ❌ Rechazar
                    </button>
                </div>
            </div>
        </td>
        `;
        tbody.appendChild(tr);
    });

    // Listeners botones
    tbody.querySelectorAll('.btn-link-orden').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            abrirEdicionOrden(btn.dataset.id);
        });
    });
    tbody.querySelectorAll('.btn-liquidar').forEach(btn => {
        btn.addEventListener('click', () => abrirModalLiquidacion(btn.dataset.id));
    });
    

    // ✅ Checkbox "Seleccionar todos"
    const chkTodos = document.getElementById('chk-todos');
    if (chkTodos) {
        // Resetear estado al re-renderizar
        chkTodos.checked = false;
        chkTodos.onchange = () => {
            document.querySelectorAll('.chk-orden').forEach(chk => {
                chk.checked = chkTodos.checked;
            });
        };
    }

    // Paginación
    const totalPaginas = Math.ceil(datosParaMostrar.length / filasPorPagina);
    const cont = document.getElementById("paginacion");
    if (cont) {
        cont.innerHTML = "";
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === paginaActual) btn.classList.add("active");
            btn.onclick = () => {
                paginaActual = i;
                aplicarFiltros();
            };
            cont.appendChild(btn);
        }
    }
    // Al final de renderTablaAgendadas, después de crear las filas:
    if (window.usuarioActivo?.rol === 'lector') {
        // Ocultar checkboxes de selección
        document.querySelectorAll('#tabla-agendadas .chk-orden').forEach(chk => {
            chk.style.display = 'none';
        });
        document.getElementById('chk-todos')?.style.setProperty('display', 'none', 'important');
        
        // Ocultar botones de liquidar/rechazar
        document.querySelectorAll('.btn-liquidar, .btn-rechazar').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Ocultar botones de acción masiva
        document.getElementById('btnEnviarCorreo')?.style.setProperty('display', 'none', 'important');
        document.getElementById('btnEnviarWhatsapp')?.style.setProperty('display', 'none', 'important');
    }
}


function resetFiltros() {
    paginaActual = 1;
    const inputs = ['filtro-buscador', 'filtro-tecnico', 'filtro-region', 'filtro-servicio', 'filtro-fecha'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        }
    });
    
    // ✅ Limpiar y recargar select de comuna correctamente
    const comunaSelect = document.getElementById('filtro-comuna');
    const regionSelect = document.getElementById('filtro-region');
    if (comunaSelect && regionSelect) {
        cargarComunas(comunaSelect, regionSelect); // Recarga comunas según región (vacía)
        comunaSelect.value = ''; // Asegura que quede vacío
    }
    
    // Aplicar los filtros (que ahora estarán vacíos)
    aplicarFiltros();
    
    mostrarToast("✅ Filtros limpiados.", "success"); // ✅ Feedback visual
}

function exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ordenes.filter(o => o.estado === 'Agendada'));
    XLSX.utils.book_append_sheet(wb, ws, "Agendadas");
    XLSX.writeFile(wb, "Reporte_Agendadas.xlsx");
}

function enviarPorCorreo() {
    const tecnicoFiltrado = document.getElementById('filtro-tecnico')?.value;
    if (!tecnicoFiltrado) return mostrarToast("Seleccione un técnico en los filtros.", "error");
    const tecnico = appData.empleados.find(emp => `${emp.nombre1} ${emp.apepaterno}` === tecnicoFiltrado && emp.activo);
    if (!tecnico || !tecnico.email) return mostrarToast(`No se encontró email para el técnico ${tecnicoFiltrado}.`, "error");
    const filas = document.querySelectorAll("#tabla-agendadas tbody tr");
    if (filas.length === 0 || filas[0].children.length < 2)
        return mostrarToast("No hay órdenes para enviar.", "error");

    let cuerpo = `Hola ${tecnico.nombre1},Tienes las siguientes órdenes asignadas:`;

    filas.forEach((fila, index) => {
        const numero = fila.children[0].textContent;
        const fecha = fila.children[1].textContent;
        const subservicio = fila.children[2].textContent;
        const cliente = fila.children[3].textContent;
        const direccion = fila.children[5].textContent;
        const comuna = fila.children[6].textContent;
        const servicio = ordenes.find(o => o.numero === numero)?.servicio || '—';
        cuerpo += `${index + 1}. Orden #${numero}
    Fecha: ${fecha}
    Servicio: ${servicio}
    Subservicio: ${subservicio}
    Cliente: ${cliente}
    Dirección: ${direccion}
    Comuna: ${comuna}
    `;
    });
    cuerpo += "Saludos.";
    const templateParams = {
        to_email: tecnico.email,
        to_name: tecnico.nombre1,
        subject: "Tus Órdenes de Trabajo – Sistema de Gestión",
        message: cuerpo
    };
    emailjs.send('service_8p2y4a6', 'template_m8313jl', templateParams)
        .then(() => {
            mostrarToast(`Correo enviado correctamente a ${tecnico.email}.`, "success");
        })
        .catch((error) => {
            console.error("Error al enviar correo:", error);
            mostrarToast("No se pudo enviar el correo. Revisar consola.", "error");
        });
}

function enviarPorWhatsapp() {
    const tecnicoFiltrado = document.getElementById('filtro-tecnico')?.value;
    if (!tecnicoFiltrado) return mostrarToast("Seleccione un técnico en los filtros.", "error");
 
    const tecnico = appData.empleados.find(emp =>
        `${emp.nombre1} ${emp.apepaterno}` === tecnicoFiltrado && emp.activo
    );
    if (!tecnico || !tecnico.telefono) {
        return mostrarToast(`No se encontró teléfono para el técnico ${tecnicoFiltrado}.`, "error");
    }
 
    let numero = tecnico.telefono.replace(/\D/g, '');
    if (numero.length === 9 && numero.startsWith('9')) {
        numero = '56' + numero;
    }
 
    const todasLasFilas = document.querySelectorAll("#tabla-agendadas tbody tr");
    const filasSeleccionadas = [...todasLasFilas].filter(fila => {
        const chk = fila.querySelector('.chk-orden');
        return chk && chk.checked;
    });
 
    if (filasSeleccionadas.length === 0) {
        return mostrarToast("Marca al menos una orden para enviar por WhatsApp.", "error");
    }
 
    let mensaje = `Buen día ${tecnico.nombre1}... tienes las siguientes órdenes:\n`;
 
    filasSeleccionadas.forEach((fila, index) => {
        const numeroOrden = fila.children[1]?.textContent?.trim() || '—';
        const fecha       = fila.children[2]?.textContent?.trim() || '—';
        const subservicio = fila.children[3]?.textContent?.trim() || '—';
        const cliente     = fila.children[4]?.textContent?.trim() || '—';
        const direccion   = fila.children[6]?.textContent?.trim() || '—';
        const comuna      = fila.children[7]?.textContent?.trim() || '—';
 
        const orden = ordenes.find(o => o.numero === numeroOrden);
 
        // ✅ RUT formateado
        const rutRaw = orden?.rut_cliente || orden?.rut || '—';
        const rut = rutRaw !== '—'
            ? rutRaw.replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, '$1.$2.$3-$4')
            : '—';
 
        // Teléfono cliente
        const telefonoCliente = orden?.telefono_contacto
            || orden?.telefonoContacto
            || orden?.numero_contacto
            || '—';
 
        // Observación limpia
        const observacion = (orden?.observacion || '').trim().replace(/\s+/g, ' ');
 
        // Separador entre órdenes
        if (index > 0) {
            mensaje += `\n${'─'.repeat(30)}\n`;
        }
 
        // ✅ Orden de campos según lo pedido
        mensaje += `\nOrden ${numeroOrden}`;
        mensaje += `\nCliente: ${cliente}`;
        mensaje += `\nRut: ${rut}`;
        mensaje += `\nFecha: ${fecha}`;
        mensaje += `\nServicio: ${orden?.servicio || '—'}`;
        mensaje += `\nSubservicio: ${subservicio}`;
        mensaje += `\nTelefono: ${telefonoCliente}`;
        mensaje += `\nDireccion: ${direccion}`;
        mensaje += `\nComuna: ${comuna}`;
        if (observacion) {
            mensaje += `\nObservacion: ${observacion}`;
        }
    });
 
    mensaje += `\n\n${'═'.repeat(30)}`;
    mensaje += `\n¡Éxito en terreno a los tigres!! `;
 
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ============================================
// --- Lógica de Búsqueda ---
// ============================================
function buscarPorOrden() {
    const input = document.getElementById('buscar-orden-input');
    const resultadoDiv = document.getElementById('resultado-orden');
    if (!input || !resultadoDiv) return;
    
    resultadoDiv.innerHTML = '';
    const numeroOrden = input.value.trim();
    if (!numeroOrden) return mostrarToast("Ingrese un número de orden.", "error");
    
    const orden = ordenes.find(o => o.numero === numeroOrden);
    if (!orden) {
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">Orden no encontrada.</p>`;
        return;
    }

    // ✅ CORRECCIÓN: formatearRut SIN PUNTOS
    function formatearRut(rut) {
        if (!rut) return '—';
        // ✅ SIN PUNTOS - Solo cuerpo + guión + DV
        const cuerpo = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
        return `${cuerpo}-${dv}`; // Formato: 12345678-9
    }

    function asegurarArray(valor) {
        if (!valor) return [];
        if (Array.isArray(valor)) {
            if (valor.length > 0 && typeof valor[0] === 'object' && valor[0] !== null) {
                return valor.map(item => item.serie || item.serie1 || '').filter(s => s);
            }
            return valor.filter(s => s !== null && s !== undefined && s !== '');
        }
        return [String(valor)].filter(s => s);
    }

    const colorEstado = orden.estado === 'Agendada' ? '#dbeafe'
        : orden.estado === 'Liquidadas' ? '#dcfce7' : '#fee2e2';
    const colorTexto = orden.estado === 'Agendada' ? '#1e40af'
        : orden.estado === 'Liquidadas' ? '#166534' : '#991b1b';

    let html = `
    <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin-top:12px; border-left:4px solid #28a745;">
        <h3 style="margin-top:0; color:#1e293b;">🔍 Detalle de la Orden #${orden.numero}</h3>
        <div style="display:grid; gap:12px; margin-top:15px;">
            <p style="margin:0;"><strong>RUT:</strong> ${formatearRutParaVisualizacion(orden.rut_cliente)}</p>
            <p style="margin:0;"><strong>Número de Orden:</strong> ${orden.numero}</p>
            <p style="margin:0;"><strong>Titular:</strong> ${orden.nombre_cliente || '—'}</p>
            <p style="margin:0;"><strong>Direccion:</strong> ${orden.direccion || '—'}</p>
            <p style="margin:0;"><strong>Teléfono de contacto:</strong> ${orden.numero_contacto || '—'}</p>
            <p style="margin:0;"><strong>Persona que recibe:</strong> ${orden.nombre_recibe || orden.nombreRecibe || '—'}</p>
            <p style="margin:0;"><strong>Teléfono recibe:</strong> ${orden.telefono_contacto || orden.telefonoContacto || '—'}</p>
            <p style="margin:0;"><strong>Estado:</strong> <span style="background:${colorEstado}; color:${colorTexto}; padding:4px 12px; border-radius:12px; font-size:13px; font-weight:600;">${orden.estado || '—'}</span></p>
            <p style="margin:0;"><strong>Fecha:</strong> ${orden.fecha}</p>
            <p style="margin:0;"><strong>Técnico:</strong> ${orden.tecnico || '—'}</p>
            <p style="margin:0;"><strong>Despacho:</strong> ${orden.despacho || '—'}</p>
            <p style="margin:0;"><strong>Servicio:</strong> ${orden.servicio || '—'} → ${orden.subservicio || '—'}</p>
    `;

    const seriesEntrada = asegurarArray(orden.series_entrada);
    html += `<p style="margin:0;"><strong>Decos entrantes:</strong> ${seriesEntrada.length ? seriesEntrada.join(', ') : '—'}</p>`;
    
    const seriesTarjetas = asegurarArray(orden.series_tarjetas);
    html += `<p style="margin:0;"><strong>Tarjetas entrantes:</strong> ${seriesTarjetas.length ? seriesTarjetas.join(', ') : '—'}</p>`;
    
    const seriesLNB = asegurarArray(orden.series_lnb);
    html += `<p style="margin:0;"><strong>LNB entrantes:</strong> ${seriesLNB.length ? seriesLNB.join(', ') : '—'}</p>`;
    
    const seriesSalida = asegurarArray(orden.series_salida);
    if (seriesSalida.length > 0) {
        html += `<p style="margin:0;"><strong>Equipos retirados:</strong> ${seriesSalida.join(', ')}</p>`;
    }

    const seriesSalidaTarjetas = asegurarArray(orden.series_salida_tarjetas);
    if (seriesSalidaTarjetas.length > 0) {
        html += `<p style="margin:0;"><strong>Tarjetas retiradas:</strong> <span style="color:#e67e00;font-weight:600;">${seriesSalidaTarjetas.join(', ')}</span></p>`;
    }

    if (orden.observacion) {
        html += `<p style="margin:0;"><strong>Observación:</strong> ${orden.observacion}</p>`;
    }
    if (orden.observacion_liquidacion) {
        html += `<p style="margin:0;"><strong>Observación de liquidación:</strong> ${orden.observacion_liquidacion}</p>`;
    }
    if (orden.estado === 'Rechazada' && orden.motivo_rechazo) {
        html += `<p style="margin:0;"><strong>Motivo rechazo:</strong> ${orden.motivo_rechazo} — ${orden.observacion_rechazo || ''}</p>`;
    }
    if (orden.coordenadas) {
        html += `<p style="margin:0;"><strong>Coordenadas:</strong> ${orden.coordenadas}</p>`;
    }
    html += `</div></div>`;
    resultadoDiv.innerHTML = html;
}

// =======================================================
// --- BÚSQUEDA POR RUT (VERSIÓN COMPLETA CON TODOS LOS DATOS) ---
// =======================================================
function buscarPorRut() {
    const input = document.getElementById('buscar-rut-input');
    const resultadoDiv = document.getElementById('resultado-rut');
    
    if (!input || !resultadoDiv) return;
    
    resultadoDiv.innerHTML = '';
    const rut = input.value.trim();
    
    if (!rut) return mostrarToast("Ingrese un RUT.", "error");
    
    const rutNormalizado = normalizarRut(rut);
    const ordenesFiltradas = ordenes.filter(o => o.rut_cliente === rutNormalizado);
    
    if (ordenesFiltradas.length === 0) {
        resultadoDiv.innerHTML = '<p style="color: #dc3545;">❌ No se encontraron órdenes para este RUT.</p>';
        return;
    }
    
    // ✅ Función auxiliar para manejar arrays de series
    function asegurarArray(valor) {
        if (!valor) return [];
        if (Array.isArray(valor)) {
            if (valor.length > 0 && typeof valor[0] === 'object' && valor[0] !== null) {
                return valor.map(item => item.serie || item.serie1 || '').filter(s => s);
            }
            return valor.filter(s => s);
        }
        return [String(valor)].filter(s => s);
    }
    
    // ✅ HEADER CON INFORMACIÓN DEL CLIENTE
    const primeraOrden = ordenesFiltradas[0];
    let html = `
    <div style="
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    ">
        <h3 style="margin: 0 0 15px 0; font-size: 1.3em;">📋 Información del Cliente</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">Nombre:</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; font-size: 1.1em;">${primeraOrden.nombre_cliente || '—'}</p>
            </div>
            <div>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">RUT:</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; font-size: 1.1em;">${formatearRutParaVisualizacion(primeraOrden.rut_cliente)}</p>
            </div>
            <div>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">Total Órdenes:</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; font-size: 1.1em;">${ordenesFiltradas.length}</p>
            </div>
        </div>
    </div>
    
    <h4 style="margin: 20px 0 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        📦 Órdenes Encontradas (${ordenesFiltradas.length})
    </h4>
    `;
    
    // ✅ LISTA DE ÓRDENES COLAPSABLE (ACORDEÓN) - CON TODOS LOS DATOS
    ordenesFiltradas.forEach((orden, index) => {
        const ordenId = `orden-rut-${orden.id || index}`;
        const estadoColor = orden.estado === 'Liquidadas' ? '#28a745' : 
                           orden.estado === 'Rechazada' ? '#dc3545' : 
                           orden.estado === 'Agendada' ? '#007bff' : '#ffc107';
        
        // Campos de liquidación y generales
        const nombreRecibe = orden.nombre_recibe || orden.nombreRecibe || '—';
        const telefonoRecibe = orden.telefono_contacto || orden.telefonoContacto || '—';
        const observacion = orden.observacion_liquidacion || orden.observacionLiquidacion || orden.observacion || '—';
        const coordenadas = orden.coordenadas || orden.coord || orden.Coordenadas || '—';
        
        // Series con protección
        const seriesEntrada = asegurarArray(orden.series_entrada).join(', ') || '—';
        const seriesTarjetas = asegurarArray(orden.series_tarjetas).join(', ') || '—';
        const seriesLNB = asegurarArray(orden.series_lnb).join(', ') || '—';
        const seriesSalida = asegurarArray(orden.series_salida).join(', ') || '—';
        const seriesSalidaTarjetas = asegurarArray(orden.series_salida_tarjetas).join(', ') || '—';
        
        html += `
        <div style="
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            margin-bottom: 12px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        ">
            <!-- HEADER DE LA ORDEN (SIEMPRE VISIBLE) -->
            <div onclick="document.getElementById('${ordenId}').classList.toggle('d-none')" 
                 style="
                    padding: 15px 20px;
                    background: #f8f9fa;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.2s;
                 "
                 onmouseover="this.style.background='#e9ecef'"
                 onmouseout="this.style.background='#f8f9fa'">
                
                <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                    <span style="font-size: 1.2em; font-weight: 700; color: #007bff;">
                        📋 ${orden.numero}
                    </span>
                    <span style="
                        background: ${estadoColor};
                        color: white;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 0.85em;
                        font-weight: 600;
                    ">${orden.estado || 'Sin estado'}</span>
                    <span style="color: #666; font-size: 0.9em;">📅 ${orden.fecha || '—'}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #666; font-size: 0.9em;">
                        ${orden.servicio || '—'} → ${orden.subservicio || '—'}
                    </span>
                    <span style="font-size: 1.2em; color: #007bff;">▼</span>
                </div>
            </div>
            
            <!-- DETALLE COMPLETO DE LA ORDEN (COLAPSABLE) -->
            <div id="${ordenId}" class="d-none" style="padding: 20px; background: white; border-top: 1px solid #ddd;">
                
                <!-- SECCIÓN 1: DATOS GENERALES -->
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        📋 Datos Generales
                    </h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🔢 N° Orden</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.numero || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">👤 Titular</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.nombre_cliente || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🆔 RUT</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${formatearRutParaVisualizacion(orden.rut_cliente)}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">📞 Teléfono Contacto</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.numero_contacto || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">👥 Persona que Recibe</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${nombreRecibe}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">📱 Teléfono Recibe</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${telefonoRecibe}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">📅 Fecha</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.fecha || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🔷 Estado</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500; color: ${estadoColor};">${orden.estado || '—'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- SECCIÓN 2: UBICACIÓN Y ASIGNACIÓN -->
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        📍 Ubicación y Asignación
                    </h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🔧 Técnico</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.tecnico || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🚚 Despacho</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.despacho || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🏠 Dirección</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.direccion || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🏙️ Comuna</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.comuna || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🗺️ Región</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.region || '—'}</p>
                        </div>
                        ${coordenadas !== '—' ? `
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">📍 Coordenadas</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500; font-family: monospace;">${coordenadas}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- SECCIÓN 3: SERVICIO -->
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        ⚙️ Servicio
                    </h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">📦 Servicio</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.servicio || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">🔹 Subservicio</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.subservicio || orden.subServicio || '—'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- SECCIÓN 4: EQUIPOS Y SERIES (SOLO SI HAY DATOS O ES LIQUIDADA) -->
                ${(seriesEntrada !== '—' || seriesTarjetas !== '—' || seriesLNB !== '—' || seriesSalida !== '—' || orden.estado === 'Liquidadas') ? `
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        📦 Equipos y Series
                    </h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0 0 5px 0; color: #28a745; font-weight: 600; font-size: 0.9em;">✅ Decos Entrantes:</p>
                            <p style="margin: 0; color: #333; font-family: monospace; font-size: 0.9em; word-break: break-all;">${seriesEntrada}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 5px 0; color: #28a745; font-weight: 600; font-size: 0.9em;">✅ Tarjetas Entrantes:</p>
                            <p style="margin: 0; color: #333; font-family: monospace; font-size: 0.9em; word-break: break-all;">${seriesTarjetas}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 5px 0; color: #28a745; font-weight: 600; font-size: 0.9em;">✅ LNB Entrantes:</p>
                            <p style="margin: 0; color: #333; font-family: monospace; font-size: 0.9em; word-break: break-all;">${seriesLNB}</p>
                        </div>
                        ${seriesSalida !== '—' ? `
                        <div>
                            <p style="margin: 0 0 5px 0; color: #dc3545; font-weight: 600; font-size: 0.9em;">♻️ Equipos Retirados:</p>
                            <p style="margin: 0; color: #333; font-family: monospace; font-size: 0.9em; word-break: break-all;">${seriesSalida}</p>
                        </div>
                        ` : ''}
                        ${seriesSalidaTarjetas !== '—' ? `
                        <div>
                            <p style="margin: 0 0 5px 0; color: #dc3545; font-weight: 600; font-size: 0.9em;">♻️ Tarjetas Retiradas:</p>
                            <p style="margin: 0; color: #333; font-family: monospace; font-size: 0.9em; word-break: break-all;">${seriesSalidaTarjetas}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                
                <!-- SECCIÓN 5: OBSERVACIONES Y MOTIVOS -->
                ${observacion !== '—' || orden.motivo_rechazo || orden.motivoRechazo ? `
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        📝 Observaciones
                    </h5>
                    ${orden.estado === 'Rechazada' && (orden.motivo_rechazo || orden.motivoRechazo) ? `
                    <div style="
                        background: #f8d7da;
                        border-left: 4px solid #dc3545;
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 10px;
                    ">
                        <p style="margin: 0 0 5px 0; color: #721c24; font-weight: 600; font-size: 0.9em;">❌ Motivo de Rechazo:</p>
                        <p style="margin: 0; color: #721c24; font-size: 0.95em;">
                            ${orden.motivo_rechazo || orden.motivoRechazo}
                            ${orden.observacion_rechazo ? `<br><strong>Detalle:</strong> ${orden.observacion_rechazo}` : ''}
                        </p>
                    </div>
                    ` : ''}
                    ${observacion !== '—' ? `
                    <div style="
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 12px;
                        border-radius: 6px;
                    ">
                        <p style="margin: 0 0 5px 0; color: #856404; font-weight: 600; font-size: 0.9em;">📝 Observación:</p>
                        <p style="margin: 0; color: #856404; font-size: 0.95em;">${observacion}</p>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <!-- SECCIÓN 6: FERRETERÍA (SI EXISTE) -->
                ${orden.ferreteria ? `
                <div style="margin-bottom: 20px;">
                    <h5 style="margin: 0 0 12px 0; color: #007bff; border-bottom: 1px solid #007bff; padding-bottom: 8px; font-size: 1em;">
                        🔩 Ferretería Utilizada
                    </h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">Conectores</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.ferreteria.conectores || '0'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">Cable (mts)</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.ferreteria.cable || '0'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">LNB</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.ferreteria.lnb || '—'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666; font-size: 0.85em; font-weight: 600;">Antena</p>
                            <p style="margin: 3px 0 0 0; font-weight: 500;">${orden.ferreteria.antena || '—'}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
                
            </div>
        </div>
        `;
    });
    
    // ✅ AGREGAR ESTILOS CSS PARA LA CLASE d-none
    if (!document.getElementById('estilos-buscar-rut')) {
        const style = document.createElement('style');
        style.id = 'estilos-buscar-rut';
        style.textContent = `.d-none { display: none !important; }`;
        document.head.appendChild(style);
    }
    
    resultadoDiv.innerHTML = html;
}

function buscarColaborador() {
    const input = document.getElementById('buscar-colab-input');
    const resultadoDiv = document.getElementById('resultado-busqueda-colab');
    if (!input || !resultadoDiv) return;
    const termino = input.value.trim();
    if (!termino) return mostrarToast("Ingrese un RUT o nombre para buscar.", "error");
    const resultados = appData.empleados.filter(emp => {
        const nombreCompleto = `${emp.nombre1} ${emp.nombre2 || ''} ${emp.apepaterno} ${emp.apematerno}`.toLowerCase();
        return emp.rut.includes(termino) || nombreCompleto.includes(termino.toLowerCase());
    });
    if (resultados.length === 0) {
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">No se encontraron colaboradores con ese criterio.</p>`;
        return;
    }

    let html = `<h3>Resultados (${resultados.length})</h3>`;
    resultados.forEach(emp => {
        const cargo = appData.cargos.find(c => c.id === emp.cargoId)?.nombre || 'Sin cargo';
        
        html += `
            <div style="background:#f8f9fa; padding:16px; border-radius:10px; margin:12px 0; border-left:4px solid #007bff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h4 style="margin-top:0; color:#333;">${emp.nombre1} ${emp.nombre2 || ''} ${emp.apepaterno} ${emp.apematerno}</h4>
            <p><strong>RUT:</strong> ${emp.rut}</p>
                <p><strong>Teléfono:</strong> ${emp.telefono || '—'}</p>
                <p><strong>Email:</strong> ${emp.email || '—'}</p>
                <p><strong>Dirección:</strong> ${emp.direccion || '—'}</p>
                <p><strong>Región:</strong> ${emp.region || '—'}</p>
                <p><strong>Comuna:</strong> ${emp.comuna || '—'}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${emp.fechaNacimiento || '—'}</p>
                <p><strong>Cargo:</strong> ${cargo}</p>
                <p><strong>Fecha de Ingreso:</strong> ${emp.fechaIngreso ||'—'}</p>
                <p><strong>Estado:</strong> ${emp.activo ?'✅ Activo' : '❌ Inactivo'}</p>${emp.observacion ?`
                <p><strong>Observaciones:</strong> ${emp.observacion}</p>` : ''}
                <button class="btn-editar-colab" data-id="${emp.id}" style="margin-top:12px; background:#007bff; color:white; border:none; padding:8px 16px; border-radius:5px; cursor:pointer;">
                    ✏️ Editar
                </button>
            </div>
        `;
    });
    resultadoDiv.innerHTML = html;
    resultadoDiv.querySelectorAll('.btn-editar-colab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            abrirEdicionEmpleado(e.target.dataset.id);
        });
    });
}

// ============================================
// --- Lógica del Módulo RRHH ---
// ============================================
function renderGestionCargos() {
    const lista = document.getElementById('lista-cargos');
    if (!lista) return;
    lista.innerHTML = "";
    if (appData.cargos.length === 0) {
        lista.innerHTML = `<li style="text-align: center; color: #666;">No hay cargos definidos.</li>`;
        return;
    }
    appData.cargos.forEach(cargo => {
        const li = document.createElement('li');
        li.className = 'lista-gestion-item';
        li.innerHTML = `<span>${cargo.nombre}</span><button class="btn-eliminar" data-id="${cargo.id}">Eliminar</button>`;
        lista.appendChild(li);
    });
    lista.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => eliminarCargo(btn.dataset.id));
    });
}

async function renderTablaPersonal() {
    const tbody = document.querySelector("#tabla-personal tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (appData.empleados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay personal registrado.</td></tr>`;
        return;
    }
    appData.empleados.forEach(emp => {
        const cargo = appData.cargos.find(c => c.id === emp.cargoId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emp.nombre1} ${emp.nombre2 || ''} ${emp.apepaterno} ${emp.apematerno}</td>
            <td>${emp.rut}</td>
            <td>${cargo ? cargo.nombre : 'No asignado'}</td>
            <td>${emp.fechaIngreso}</td>
            <td>
                <div class="acciones-celda">
                    <button class="btn-editar" data-id="${emp.id}">✏️ Editar</button>
                    <label class="switch">
                        <input type="checkbox"class="toggle-activo" data-id="${emp.id}" ${emp.activo ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                    <span class="estado-texto">${emp.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
});
    tbody.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => abrirEdicionEmpleado(btn.dataset.id));
    });
    document.querySelectorAll('.toggle-activo').forEach(toggle => {
        toggle.addEventListener('change', async function() {
            const id = this.dataset.id;
            const empleado = appData.empleados.find(e => e.id === id);
            if (empleado) {
                empleado.activo = this.checked;
                await supabase.from('cargos').insert([nuevoCargo]);
                actualizarPersonal();
                mostrarToast(`Colaborador ${empleado.activo ? 'activado' : 'desactivado'} con éxito.`);
            }
        });
    });
}

async function agregarCargo() {
    const input = document.getElementById('nuevo-cargo-nombre');
    if (!input) return;
    const nombre = input.value.trim();
    if (!nombre) return mostrarToast("Debe ingresar un nombre para el cargo.", "error");
    if (appData.cargos.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        return mostrarToast("Ese cargo ya existe.", "error");
    }
    appData.cargos.push({ id: `cargo-${Date.now()}`, nombre });
    await supabase.from('cargos').insert([nuevoCargo]);
    renderGestionCargos();
    input.value = "";
    mostrarToast("Cargo agregado con éxito.");
}

async function eliminarCargo(cargoId) {
    const cargosEsenciales = [
        'cargo-tecnico', 'cargo-despacho', 'cargo-supervisor',
        'cargo-enc-bodega', 'cargo-enc-rrhh', 'cargo-jefatura', 'cargo-admin'
    ];
    if (cargosEsenciales.includes(cargoId)) {
        return mostrarToast("No se puede eliminar este cargo esencial.", "error");
    }
    if (appData.empleados.some(emp => emp.cargoId === cargoId)) {
        return mostrarToast("No se puede eliminar, el cargo está en uso por un colaborador.", "error");
    }
    if (confirm("¿Está seguro de que desea eliminar este cargo?")) {
        appData.cargos = appData.cargos.filter(c => c.id !== cargoId);
        await supabase.from('cargos').insert([nuevoCargo]);
        renderGestionCargos();
        mostrarToast("Cargo eliminado.");
    }
}

function setupFormularioNuevoIngreso() {
    const empCargo = document.getElementById('emp-cargo');
    const grupoLicencia = document.getElementById('grupo-licencia-tecnico');
    const fechaLicencia = document.getElementById('emp-fecha-vencimiento-licencia');

    if (empCargo) {
        populateSelect(empCargo, appData.cargos.map(c => ({ value: c.id, text: c.nombre })), "Seleccione Cargo");
        empCargo.addEventListener('change', () => {
            const cargoSeleccionado = appData.cargos.find(c => c.id === empCargo.value);
            const esTecnico = cargoSeleccionado && esCargoTecnico(cargoSeleccionado.nombre);
            if (esTecnico) {
                grupoLicencia.style.display = 'block';
                fechaLicencia.setAttribute('required', 'required');
            
            } else {
                grupoLicencia.style.display = 'none';
                fechaLicencia.removeAttribute('required');
                fechaLicencia.value = '';
            }
        });
    }
}

async function guardarNuevoEmpleado(event) {
    event.preventDefault();
    console.log("🚀 Iniciando guardado de nuevo colaborador...");
    // 1. CAPTURA DE DATOS DEL FORMULARIO Y VALIDACIONES
    const rutInput = document.getElementById('emp-rut')?.value.trim();
    if (!rutInput || !validarRutChileno(rutInput)) {
        return mostrarToast("⛔ El RUT ingresado no es válido.", "error");
    }
    const nombre1 = document.getElementById('emp-nombre1')?.value.trim() || '';
    const nombre2 = document.getElementById('emp-nombre2')?.value.trim() || '';
    const apepaterno = document.getElementById('emp-apepaterno')?.value.trim() || '';
    const apematerno = document.getElementById('emp-apematerno')?.value.trim() || '';
    const cargoId = document.getElementById('emp-cargo')?.value;
    const telefono = document.getElementById('emp-telefono')?.value.trim() || '';
    const direccion = document.getElementById('emp-direccion')?.value.trim() || '';
    const email = document.getElementById('emp-email')?.value.trim() || '';
    const fechaIngreso = document.getElementById('emp-fecha-ingreso')?.value || null;
    const observacion = document.getElementById('emp-observacion')?.value.trim() || '';
    const fechaNac = document.getElementById('emp-fecha-nac')?.value || null;
        if (fechaNac) {
        const fechaNacimiento = new Date(fechaNac);
        const hoy = new Date();
        
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        const dia = hoy.getDate() - fechaNacimiento.getDate();
        
        // Ajustar edad si aún no cumplió años este año
        if (mes < 0 || (mes === 0 && dia < 0)) {
            edad--;
        }
        
        if (edad < 18) {
            return mostrarToast(`⛔ El colaborador debe ser mayor de 18 años. Edad actual: ${edad} años.`, "error");
        }
    }
    if (!nombre1 || !apepaterno || !apematerno || !cargoId || !fechaIngreso || !fechaNac) {
        return mostrarToast("Por favor, complete todos los campos obligatorios.", "error");
    }

    // 2. CAPTURA DE REGIÓN Y COMUNA COMO TEXTO LIBRE (¡NO SON SELECT!)
    const regionEmpleado = document.getElementById('emp-region')?.value.trim() || '';
    const comunaEmpleado = document.getElementById('emp-comuna')?.value.trim() || '';

    // 3. LÓGICA DE LICENCIA (solo para técnicos)
    const cargoSeleccionado = appData.cargos.find(c => c.id === cargoId);
    const esTecnico = cargoSeleccionado && esCargoTecnico(cargoSeleccionado.nombre);
    let fechaLicencia = null;
    if (esTecnico) {
        fechaLicencia = document.getElementById('emp-fecha-vencimiento-licencia')?.value || null;
        if (!fechaLicencia) {
            return mostrarToast("La fecha de vencimiento de licencia es obligatoria para técnicos.", "error");
        }
    }

    // 4. PREPARAR OBJETO PARA BASE DE DATOS
    const empleadoBD = {
        rut: rutInput,
        nombre1,
        nombre2,
        apepaterno,
        apematerno,
        cargo: cargoId,
        telefono,
        direccion,
        region: regionEmpleado, 
        comuna: comunaEmpleado,
        email,
        observacion,
        fecha_nacimiento: fechaNac,
        fecha_ingreso: fechaIngreso,
        fecha_vencimiento_licencia: fechaLicencia,
        activo: true,
        stock: { equipos: [], tarjetas: [], lnbs: [] }
    };

    // 5. GUARDAR EN SUPABASE
    try {
        const { data, error } = await supabase.from('empleados').insert([empleadoBD]).select();
        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error("No se recibieron datos de confirmación de la base de datos.");
        }
        console.log("✅ Empleado guardado en Supabase:", data[0]);

        // 6. ACTUALIZAR MEMORIA LOCAL
        const nuevoEmpleadoLocal = {
            id: data[0].id,
            rut: rutInput,
            nombre1, nombre2, apepaterno, apematerno,
            cargoId: cargoId,
            telefono, direccion,
            region: regionEmpleado,
            comuna: comunaEmpleado, 
            email, observacion,
            fechaNacimiento: fechaNac,
            fechaIngreso: fechaIngreso,
            fechaVencimientoLicencia: fechaLicencia,
            activo: true,
            stock: { equipos: [], tarjetas: [], lnbs: [] }
        };

        if (!appData.empleados) appData.empleados = [];
        appData.empleados.push(nuevoEmpleadoLocal);

        // 7. FINALIZAR
        mostrarToast(`✅ Colaborador ${nombre1} ${apepaterno} guardado con éxito.`, "success");
        if (esTecnico && typeof cargarTecnicosAsignacion === 'function') {
            cargarTecnicosAsignacion();
        }
        document.getElementById('form-nuevo-ingreso').reset();
        const grupoLicencia = document.getElementById('grupo-licencia-tecnico');
        if (grupoLicencia) grupoLicencia.style.display = 'none';

        mostrarPanel('panel-lista-personal');
        if (typeof renderTablaPersonal === 'function') {
            renderTablaPersonal();
        }

    } catch (err) {
        console.error("❌ Error al guardar en Supabase:", err);
        let mensajeError = "Error al guardar en la nube. Revise su conexión o los nombres de las columnas.";
        if (err.code === '23505') {
            mensajeError = "El RUT ya existe en la base de datos.";
        }
        mostrarToast(mensajeError, "error");
    }
}

// =======================================================
// === EDICIÓN DE EMPLEADOS - VERSIÓN ACTUALIZADA ===
// =======================================================

function abrirEdicionEmpleado(empleadoId) {
    const empleado = appData.empleados.find(e => e.id === empleadoId);
    
    if (!empleado) {
        console.error('❌ Empleado no encontrado con ID:', empleadoId);
        return mostrarToast("Empleado no encontrado.", "error");
    }

    console.log('📝 Abriendo edición para:', empleado.nombre1, empleado.apepaterno);

    // === 1. LLENAR CAMPOS BÁSICOS (con validación de existencia) ===
    const camposBasicos = [
        { id: 'editar-empleado-id', value: empleado.id },
        { id: 'editar-nombre1', value: empleado.nombre1 },
        { id: 'editar-nombre2', value: empleado.nombre2 || '' },
        { id: 'editar-apepaterno', value: empleado.apepaterno },
        { id: 'editar-apematerno', value: empleado.apematerno },
        { id: 'editar-rut', value: empleado.rut },
        { id: 'editar-telefono', value: empleado.telefono || '' },
        { id: 'editar-direccion', value: empleado.direccion || '' },
        { id: 'editar-email', value: empleado.email || '' },
        { id: 'editar-fecha-nac', value: empleado.fechaNacimiento || '' },
        { id: 'editar-fecha-ingreso', value: empleado.fechaIngreso || '' },
        { id: 'editar-observacion', value: empleado.observacion || '' }
    ];

    camposBasicos.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (el) {
            el.value = campo.value;
        } else {
            console.warn(`⚠️ Elemento no encontrado: ${campo.id}`);
        }
    });

    // === 2. CARGAR CARGO (SELECT) ===
    const selectCargo = document.getElementById('editar-cargo');
    if (selectCargo) {
        populateSelect(selectCargo, 
            appData.cargos.map(c => ({ value: c.id, text: c.nombre })), 
            "Seleccione Cargo"
        );
        selectCargo.value = empleado.cargoId;
    }

    // === 3. REGION Y COMUNA → TEXTO LIBRE ===
    const elRegion = document.getElementById('editar-region');
    const elComuna = document.getElementById('editar-comuna');
    if (elRegion) elRegion.value = empleado.region || '';
    if (elComuna) elComuna.value = empleado.comuna || '';

    // === 4. ✅ LICENCIA DE CONDUCIR - LÓGICA MEJORADA ===
    const grupoLicenciaEdit = document.getElementById('grupo-licencia-tecnico-edit');
    const fechaLicenciaEdit = document.getElementById('editar-fecha-vencimiento-licencia');
    
    // Determinar si el cargo actual es técnico
    const cargoActual = appData.cargos.find(c => c.id === empleado.cargoId);
    const esTecnicoActual = cargoActual && esCargoTecnico(cargoActual.nombre);
    
    // Debug detallado
    console.log('🔍 Debug abrirEdicionEmpleado:', {
        empleadoId: empleado.id,
        cargoId: empleado.cargoId,
        cargoNombre: cargoActual?.nombre,
        esTecnico: esTecnicoActual,
        fechaVencimientoLicencia: empleado.fechaVencimientoLicencia,
        grupoLicenciaExiste: !!grupoLicenciaEdit,
        campoFechaExiste: !!fechaLicenciaEdit
    });
    
    // Manejar visualización del campo de licencia
    if (grupoLicenciaEdit && fechaLicenciaEdit) {
        if (esTecnicoActual) {
            // ✅ MOSTRAR campo de licencia SI es técnico
            grupoLicenciaEdit.style.display = 'block';
            // ✅ IMPORTANTE: Usar el valor real de la BD, no null
            fechaLicenciaEdit.value = empleado.fechaVencimientoLicencia 
                ? (typeof empleado.fechaVencimientoLicencia === 'string' 
                    ? empleado.fechaVencimientoLicencia.split('T')[0] 
                    : empleado.fechaVencimientoLicencia)
                : '';
            fechaLicenciaEdit.disabled = false;
            fechaLicenciaEdit.required = true;
            console.log('✅ Campo de licencia mostrado para técnico');
        } else {
            // ✅ OCULTAR campo de licencia si NO es técnico
            grupoLicenciaEdit.style.display = 'none';
            fechaLicenciaEdit.value = '';
            fechaLicenciaEdit.required = false;
            fechaLicenciaEdit.disabled = true;
        }
    } else {
        console.error('❌ Elementos de licencia no encontrados en el DOM');
    }
    
    // === 5. ✅ LISTENER DINÁMICO PARA CAMBIO DE CARGO ===
    if (selectCargo) {
        // Remover listeners previos clonando el elemento
        const selectClonado = selectCargo.cloneNode(true);
        selectCargo.parentNode.replaceChild(selectClonado, selectCargo);
        
        // Agregar nuevo listener al elemento reemplazado
        const nuevoSelect = document.getElementById('editar-cargo');
        if (nuevoSelect) {
            nuevoSelect.addEventListener('change', function() {
                const cargoSeleccionado = appData.cargos.find(c => c.id === this.value);
                const esTecnicoNuevo = cargoSeleccionado && esCargoTecnico(cargoSeleccionado.nombre);
                
                console.log('🔄 Cambio de cargo detectado:', {
                    nuevoCargo: cargoSeleccionado?.nombre,
                    esTecnico: esTecnicoNuevo
                });
                
                if (grupoLicenciaEdit && fechaLicenciaEdit) {
                    if (esTecnicoNuevo) {
                        // Mostrar campo y hacerlo requerido
                        grupoLicenciaEdit.style.display = 'block';
                        fechaLicenciaEdit.required = true;
                        fechaLicenciaEdit.disabled = false;
                        // Si no tiene valor previo, dejarlo vacío para que el usuario ingrese
                        if (!fechaLicenciaEdit.value) {
                            fechaLicenciaEdit.value = '';
                        }
                    } else {
                        // Ocultar campo y quitar requerimiento
                        grupoLicenciaEdit.style.display = 'none';
                        fechaLicenciaEdit.required = false;
                        fechaLicenciaEdit.disabled = true;
                        fechaLicenciaEdit.value = '';
                    }
                }
            });
        }
    }
    
    // === 6. MOSTRAR PANEL ===
    mostrarPanel('panel-editar-empleado');
    
    console.log('✅ Panel de edición abierto correctamente');
}

// =======================================================
// === GUARDAR EDICIÓN DE EMPLEADO - CORREGIDA ===
// =======================================================
async function guardarEdicionEmpleado(event) {
    if (event) event.preventDefault();
    
    const id = document.getElementById('editar-empleado-id')?.value;
    if (!id) {
        console.error('❌ ID de empleado no válido');
        return mostrarToast("Error: ID no válido.", "error");
    }

    console.log('💾 Guardando edición para empleado ID:', id);

    // === 1. VALIDAR RUT ===
    const rut = document.getElementById('editar-rut')?.value.trim();
    if (!rut || !validarRutChileno(rut)) {
        return mostrarToast("RUT inválido.", "error");
    }

    // Evitar duplicados de RUT (excepto el propio empleado)
    if (appData.empleados.some(e => e.rut === rut && e.id !== id)) {
        return mostrarToast("El RUT ya está registrado en otro colaborador.", "error");
    }

    // === 2. ENCONTRAR ÍNDICE DEL EMPLEADO ===
    const index = appData.empleados.findIndex(e => e.id === id);
    if (index === -1) {
        console.error('❌ Empleado no encontrado en appData');
        return mostrarToast("Colaborador no encontrado.", "error");
    }

    // === 3. CAPTURAR DATOS DEL FORMULARIO ===
    const datosForm = {
        nombre1: document.getElementById('editar-nombre1')?.value.trim() || '',
        nombre2: document.getElementById('editar-nombre2')?.value.trim() || '',
        apepaterno: document.getElementById('editar-apepaterno')?.value.trim() || '',
        apematerno: document.getElementById('editar-apematerno')?.value.trim() || '',
        telefono: document.getElementById('editar-telefono')?.value.trim() || '',
        direccion: document.getElementById('editar-direccion')?.value.trim() || '',
        email: document.getElementById('editar-email')?.value.trim() || '',
        observacion: document.getElementById('editar-observacion')?.value.trim() || '',
        fechaNac: document.getElementById('editar-fecha-nac')?.value || appData.empleados[index].fechaNacimiento,
        fechaIngreso: document.getElementById('editar-fecha-ingreso')?.value || appData.empleados[index].fechaIngreso,
        cargoId: document.getElementById('editar-cargo')?.value,
        region: document.getElementById('editar-region')?.value.trim() || '',
        comuna: document.getElementById('editar-comuna')?.value.trim() || ''
    };

    // Validaciones básicas
    if (!datosForm.nombre1 || !datosForm.apepaterno || !datosForm.apematerno || !datosForm.cargoId) {
        return mostrarToast("Complete todos los campos obligatorios.", "error");
    }

    // === 4. ✅ LÓGICA DE LICENCIA - CORRECCIÓN CRÍTICA ===
    const cargoSeleccionado = appData.cargos.find(c => c.id === datosForm.cargoId);
    const esTecnico = cargoSeleccionado && esCargoTecnico(cargoSeleccionado.nombre);
    
    let fechaVencimientoLicencia = null;
    
    if (esTecnico) {
        // ✅ Capturar valor DEL INPUT, incluso si el grupo estaba oculto
        const inputLicencia = document.getElementById('editar-fecha-vencimiento-licencia');
        if (inputLicencia) {
            const valorRaw = inputLicencia.value;
            // Normalizar fecha: quitar hora si viene con formato ISO
            fechaVencimientoLicencia = valorRaw 
                ? (valorRaw.includes('T') ? valorRaw.split('T')[0] : valorRaw)
                : null;
            
            console.log('📅 Valor capturado de licencia:', {
                raw: valorRaw,
                procesado: fechaVencimientoLicencia
            });
        }
        
        // Validar solo si es técnico
        if (!fechaVencimientoLicencia) {
            return mostrarToast("Debe ingresar la fecha de vencimiento de la licencia de conducir.", "error");
        }
    }
    // Si NO es técnico, fechaVencimientoLicencia se mantiene como null (correcto)

    console.log('📦 Datos a guardar:', {
        ...datosForm,
        fechaVencimientoLicencia: fechaVencimientoLicencia,
        esTecnico: esTecnico
    });

    // === 5. ACTUALIZAR EN MEMORIA LOCAL ===
    appData.empleados[index] = {
        ...appData.empleados[index],
        ...datosForm,
        rut: rut,
        fechaVencimientoLicencia: fechaVencimientoLicencia  // ✅ Siempre actualizar este campo
    };

    // === 6. ✅ GUARDAR EN SUPABASE - CORRECCIÓN CLAVE ===
    try {
        // Preparar objeto para Supabase (nombres de columna exactos)
        const datosParaSupabase = {
            nombre1: datosForm.nombre1,
            nombre2: datosForm.nombre2,
            apepaterno: datosForm.apepaterno,
            apematerno: datosForm.apematerno,
            rut: rut,
            telefono: datosForm.telefono,
            direccion: datosForm.direccion,
            region: datosForm.region,
            comuna: datosForm.comuna,
            email: datosForm.email,
            cargo: datosForm.cargoId,  // ← Nombre de columna en BD: 'cargo'
            fecha_nacimiento: datosForm.fechaNac,
            fecha_ingreso: datosForm.fechaIngreso,
            observacion: datosForm.observacion,
            // ✅ CAMPO CRÍTICO: debe coincidir EXACTAMENTE con la columna en Supabase
            fecha_vencimiento_licencia: fechaVencimientoLicencia
        };

        console.log('📤 Enviando a Supabase:', datosParaSupabase);

        const { data, error } = await supabase
            .from('empleados')
            .update(datosParaSupabase)
            .eq('id', id)
            .select();  // ← IMPORTANTE: obtener datos actualizados

        if (error) {
            console.error('❌ Error de Supabase:', error);
            throw error;
        }

        console.log('✅ Respuesta de Supabase:', data);

        // ✅ ACTUALIZAR MEMORIA LOCAL CON DATOS CONFIRMADOS DE LA BD
        if (data && data.length > 0) {
            const empleadoActualizado = data[0];
            appData.empleados[index] = {
                ...appData.empleados[index],
                fechaVencimientoLicencia: empleadoActualizado.fecha_vencimiento_licencia || null
            };
            console.log('🔄 Memoria local actualizada con fecha de licencia:', 
                appData.empleados[index].fechaVencimientoLicencia);
        }

        mostrarToast("✅ Colaborador actualizado con éxito.", "success");
        
        // Refrescar vistas
        mostrarPanel('panel-lista-personal');
        if (typeof renderTablaPersonal === 'function') {
            renderTablaPersonal();
        }
        // Si estamos en el panel de licencias, refrescarlo también
        if (typeof renderVencimientoLicencias === 'function' && 
            document.getElementById('panel-vencimiento-licencias')?.style.display !== 'none') {
            renderVencimientoLicencias();
        }

    } catch (err) {
        console.error("❌ Error crítico al actualizar en Supabase:", err);
        console.error("Detalle:", err.details || err.message || JSON.stringify(err));
        
        // Revertir cambio en memoria local en caso de error
        // (opcional, depende de tu flujo)
        
        mostrarToast("Error al guardar los cambios en la nube: " + (err.message || err), "error");
    }
}

// =======================================================
// === VENCIMIENTO DE LICENCIAS DE CONDUCIR ===
// =======================================================

function renderVencimientoLicencias() {
    const tbody = document.getElementById('tabla-vencimiento-licencias');
    if (!tbody) {
        console.error('❌ No se encontró tbody #tabla-vencimiento-licencias');
        return;
    }
    
    console.log('🔍 renderVencimientoLicencias - Empleados cargados:', appData.empleados?.length || 0);
    
    const filtroEstado = document.getElementById('filtro-estado-licencia')?.value || 'todos';
    const busqueda = document.getElementById('busqueda-tecnico-licencia')?.value.toLowerCase() || '';

    // Filtrar solo técnicos con licencia
    const tecnicosConLicencia = appData.empleados.filter(emp => {
        // ✅ CORRECCIÓN: Paréntesis correctos en la condición
        const esTecnico = appData.cargos.some(c =>
            c.id === emp.cargoId &&
            (c.nombre.toLowerCase().includes('técnico') ||
             c.nombre.toLowerCase().includes('tecnico'))
        );
        return esTecnico && emp.fechaVencimientoLicencia;
    });

    console.log('🔍 Técnicos con licencia encontrados:', tecnicosConLicencia.length);

    // Calcular estado de cada licencia
    const hoy = new Date();
    const tresMeses = new Date(hoy);
    tresMeses.setMonth(tresMeses.getMonth() + 3);

    const tecnicosProcesados = tecnicosConLicencia.map(emp => {
        const fechaVencimiento = new Date(emp.fechaVencimientoLicencia);
        const diffTiempo = fechaVencimiento - hoy;
        const diasRestantes = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
        
        let estado, color, icono;
        if (diasRestantes < 0) {
            estado = 'Vencida';
            color = '#dc3545';
            icono = '❌';
        } else if (diasRestantes <= 90) {
            estado = 'Por Vencer';
            color = '#ffc107';
            icono = '⚠️';
        } else {
            estado = 'Vigente';
            color = '#28a745';
            icono = '✅';
        }
        
        return {
            ...emp,
            fechaVencimiento,
            diasRestantes,
            estado,
            color,
            icono
        };
    });

    // Aplicar filtros
    let filtrados = tecnicosProcesados;
    if (filtroEstado !== 'todos') {
        if (filtroEstado === 'vencidas') {
            filtrados = filtrados.filter(t => t.diasRestantes < 0);
        } else if (filtroEstado === 'alerta') {
            filtrados = filtrados.filter(t => t.diasRestantes >= 0 && t.diasRestantes <= 90);
        } else if (filtroEstado === 'vigentes') {
            filtrados = filtrados.filter(t => t.diasRestantes > 90);
        }
    }

    if (busqueda) {
        filtrados = filtrados.filter(t =>
            `${t.nombre1} ${t.apepaterno}`.toLowerCase().includes(busqueda) ||
            t.rut?.toLowerCase().includes(busqueda)
        );
    }

    // Ordenar por días restantes
    filtrados.sort((a, b) => a.diasRestantes - b.diasRestantes);

    // Actualizar contadores
    document.getElementById('total-alerta').textContent =
        tecnicosProcesados.filter(t => t.diasRestantes >= 0 && t.diasRestantes <= 90).length;
    document.getElementById('total-vencidas').textContent =
        tecnicosProcesados.filter(t => t.diasRestantes < 0).length;
    document.getElementById('total-vigentes').textContent =
        tecnicosProcesados.filter(t => t.diasRestantes > 90).length;

    // Renderizar tabla
    if (filtrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:40px;color:#666;">
                    📋 No hay técnicos que coincidan con los filtros
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(t => {
        const filaColor = t.diasRestantes < 0 ? '#ffe6e6' :
            t.diasRestantes <= 90 ? '#fff3cd' : 'white';
        return `
            <tr style="background:${filaColor};border-bottom:1px solid #ddd;">
                <td style="padding:15px;">
                    <strong>${t.nombre1} ${t.apepaterno}</strong>
                    ${t.nombre2 ? `<br><small style="color:#666;">${t.nombre2}</small>` : ''}
                </td>
                <td style="padding:15px;">${t.rut || '—'}</td>
                <td style="padding:15px;text-align:center;">
                    ${t.fechaVencimiento.toLocaleDateString('es-CL')}
                </td>
                <td style="padding:15px;text-align:center;">
                    <span style="font-weight:bold;color:${t.color};">
                        ${t.diasRestantes > 0 ? t.diasRestantes : t.diasRestantes} días
                    </span>
                </td>
                <td style="padding:15px;text-align:center;">
                    <span style="background:${t.color};color:white;padding:5px 15px;border-radius:20px;font-size:13px;">
                        ${t.icono} ${t.estado}
                    </span>
                </td>
                <td style="padding:15px;text-align:center;">
                    <button onclick="abrirEdicionEmpleado('${t.id}')"
                        style="background:#007bff;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;"
                        title="Editar técnico">
                        ✏️ Editar
                    </button>
                    ${t.diasRestantes <= 90 ? `
                        <button onclick="enviarRecordatorioLicencia('${t.id}', '${t.nombre1}', '${t.email}')"
                            style="background:#ffc107;color:#333;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;"
                            title="Enviar recordatorio">
                            📧 Recordar
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Tabla renderizada con', filtrados.length, 'técnicos');
}

async function enviarRecordatorioLicencia(tecnicoId, nombre, email) {
    if (!email) {
        mostrarToast('⚠️ El técnico no tiene email registrado', 'warning');
        return;
    }
    
    if (!confirm(`📧 ¿Enviar recordatorio de vencimiento de licencia a ${nombre}?`)) {
        return;
    }
    
    mostrarLoader('Enviando recordatorio...');
    
    try {
        const tecnico = appData.empleados.find(e => e.id === tecnicoId);
        const fechaVencimiento = new Date(tecnico.fechaVencimientoLicencia).toLocaleDateString('es-CL');
        
        await emailjs.send('service_8p2y4a6', 'template_m8313jl', {
            to_email: email,
            to_name: nombre,
            subject: `⚠️ Recordatorio: Vencimiento de Licencia de Conducir`,
            message: `Hola ${nombre},
Te recordamos que tu licencia de conducir vence el ${fechaVencimiento}. Por favor, regulariza tu situación a la brevedad.
Saludos,
RRHH`
        });
        
        mostrarToast(`✅ Recordatorio enviado a ${email}`, 'success');
    } catch (err) {
        console.error('Error al enviar recordatorio:', err);
        mostrarToast('❌ Error al enviar recordatorio', 'error');
    } finally {
        ocultarLoader();
    }
}

function inicializarPanelVencimientoLicencias() {
    renderVencimientoLicencias();
}

// =======================================================
// === CUMPLEAÑOS DEL MES ===
// =======================================================

/**
 * Renderiza la lista de cumpleaños del mes seleccionado
 */
function renderCumpleanos() {
    const contenedor = document.getElementById('lista-cumpleanos');
    const sinCumpleanos = document.getElementById('sin-cumpleanos');
    const mesSelect = document.getElementById('filtro-mes-cumpleanos');
    const busqueda = document.getElementById('busqueda-cumpleanos')?.value.toLowerCase() || '';
    
    if (!contenedor) return;
    
    // Obtener mes seleccionado (o mes actual por defecto)
    const hoy = new Date();
    const mesSeleccionado = mesSelect ? parseInt(mesSelect.value) : hoy.getMonth();
    
    // Actualizar título del mes
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    document.getElementById('mes-cumpleanos').textContent = nombresMeses[mesSeleccionado];
    
    // Filtrar empleados con fecha de nacimiento en el mes seleccionado
    const cumpleaneros = appData.empleados.filter(emp => {
        if (!emp.fechaNacimiento) return false;
        
        const fechaNac = parseFechaLocal(emp.fechaNacimiento);
        const mesNac = fechaNac.getMonth();
        
        // Filtrar por mes
        if (mesNac !== mesSeleccionado) return false;
        
        // Filtrar por búsqueda
        if (busqueda) {
            const nombreCompleto = `${emp.nombre1} ${emp.nombre2 || ''} ${emp.apepaterno} ${emp.apematerno}`.toLowerCase();
            if (!nombreCompleto.includes(busqueda)) return false;
        }
        
        return true;
    });
    
    // Ordenar por día del mes
    cumpleaneros.sort((a, b) => {
        const diaA = new Date(a.fechaNacimiento).getDate();
        const diaB = new Date(b.fechaNacimiento).getDate();
        return diaA - diaB;
    });
    
    // Actualizar contadores
    document.getElementById('total-cumpleanos').textContent = cumpleaneros.length;
    
    // Calcular próximos cumpleaños (próximos 7 días desde hoy)
    const proximos7Dias = appData.empleados.filter(emp => {
        if (!emp.fechaNacimiento) return false;
        const fechaNac = parseFechaLocal(emp.fechaNacimiento);
        const hoy = new Date();
        const cumpleEsteAnio = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
        const diffDias = Math.ceil((cumpleEsteAnio - hoy) / (1000 * 60 * 60 * 24));
        return diffDias >= 0 && diffDias <= 7;
    });
    document.getElementById('proximos-cumpleanos').textContent = proximos7Dias.length;
    
    // Renderizar lista
    if (cumpleaneros.length === 0) {
        contenedor.innerHTML = '';
        sinCumpleanos.style.display = 'block';
        return;
    }
    
    sinCumpleanos.style.display = 'none';
    
    contenedor.innerHTML = cumpleaneros.map(emp => {
        const fechaNac = parseFechaLocal(emp.fechaNacimiento);
        const dia = fechaNac.getDate();
        const mes = fechaNac.getMonth();
        const anio = fechaNac.getFullYear();
        const edad = hoy.getFullYear() - anio;
        
        // Calcular días faltantes si aún no es hoy
        const cumpleEsteAnio = new Date(hoy.getFullYear(), mes, dia);
        const diffTiempo = cumpleEsteAnio - hoy;
        const diasFaltantes = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
        
        let badge = '';
        if (diasFaltantes === 0) {
            badge = '<span style="background:#dc3545;color:white;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:bold;">🎉 ¡ES HOY!</span>';
        } else if (diasFaltantes > 0 && diasFaltantes <= 7) {
            badge = `<span style="background:#ffc107;color:#333;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:bold;">🎂 En ${diasFaltantes} días</span>`;
        } else if (diasFaltantes < 0) {
            badge = '<span style="background:#28a745;color:white;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:bold;">✅ Ya celebramos</span>';
        }
        
        // Obtener cargo
        const cargo = appData.cargos.find(c => c.id === emp.cargoId)?.nombre || 'Sin cargo';
        
        return `
            <div style="background:white;padding:20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);border-top:4px solid #667eea;transition:transform 0.3s;">
                <div style="display:flex;align-items:center;margin-bottom:15px;">
                    <div style="width:60px;height:60px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:bold;margin-right:15px;">
                        ${emp.nombre1.charAt(0)}${emp.apepaterno.charAt(0)}
                    </div>
                    <div style="flex:1;">
                        <h4 style="margin:0;color:#333;font-size:16px;">${emp.nombre1} ${emp.apepaterno}</h4>
                        <p style="margin:5px 0 0 0;color:#666;font-size:13px;">${cargo}</p>
                    </div>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <div>
                        <p style="margin:0;color:#999;font-size:12px;">Fecha de nacimiento</p>
                        <p style="margin:5px 0 0 0;color:#333;font-weight:600;">${dia} de ${nombresMeses[mes]}</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="margin:0;color:#999;font-size:12px;">Cumple</p>
                        <p style="margin:5px 0 0 0;color:#667eea;font-weight:bold;">${edad} años</p>
                    </div>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    ${badge}
                    <button onclick="editarEmpleado('${emp.id}')" 
                            style="background:#007bff;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;font-size:13px;">
                        ✏️ Ver perfil
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Inicializa el panel cuando se muestra
 */
function inicializarPanelCumpleanos() {
    const hoy = new Date();
    const mesSelect = document.getElementById('filtro-mes-cumpleanos');
    
    if (mesSelect) {
        mesSelect.value = hoy.getMonth();
    }
    
    renderCumpleanos();
}

// ============================================
// --- Lógica de Cambio de Estado de Órdenes ---
// ============================================

function abrirMotivoRechazo(ordenId) {
    if (document.getElementById('modal-rechazo')) {
        document.getElementById('modal-rechazo').remove();
    }
    // ✅ VALIDAR ROL LECTOR
    if (window.usuarioActivo?.rol === 'lector') {
        mostrarToast("⛔ Rol 'Lector' no puede rechazar órdenes.", "error");
        return;
    }

    // ✅ FIX: Cerrar todos los dropdowns antes de abrir el modal
    document.querySelectorAll('.dropdown-content').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.dropdown-content-despacho').forEach(el => el.style.display = 'none');

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'modal-rechazo';
    modal.style.cssText = `
        position: fixed; 
        top: 0; left: 0; 
        width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        z-index: 999999;
        pointer-events: all;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 350px; width: 90%; pointer-events: all; position: relative; z-index: 1000000;">
        <h3 style="margin-top: 0; text-align: center;">Motivo de Rechazo</h3>
            <div id="motivos-container" style="display: flex; flex-direction: column; gap: 8px; margin: 15px 0;">
                ${TIPOS_RECHAZO.map(motivo => `
                    <button type="button" 
                            data-motivo="${motivo}" 
                            class="btn-motivo-rechazo"
                            style="background: #f8f9fa; border: 1px solid #ddd; padding: 10px; border-radius: 6px; text-align: left; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                        ${motivo}
                    </button>
                `).join('')}
            </div>
            <div>
                <label for="observacion-rechazo" style="display: block; margin-bottom: 6px; font-weight: 600;">
                    Observación (mínimo 5 caracteres):
                </label>
                <textarea id="observacion-rechazo" 
                          placeholder="Ej: Cliente no estaba en casa..." 
                          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; min-height: 60px;"></textarea>
                <div id="error-observacion" style="color: #dc3545; font-size: 0.85em; margin-top: 5px; display: none;">
                    La observación es obligatoria.
                </div>
            </div>
            <div style="text-align: right; margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" id="btnCancelarRechazo" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    Cancelar
                </button>
                <button type="button" id="btnAceptarRechazo" disabled style="background: #ccc; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: not-allowed;">
                    Aceptar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

// ✅ DEBUG TEMPORAL
console.log('🟡 Modal agregado al DOM:', document.getElementById('modal-rechazo'));
console.log('🟡 btnCancelar:', document.getElementById('btnCancelarRechazo'));
console.log('🟡 btnAceptar:', document.getElementById('btnAceptarRechazo'));

// Test directo de clic en cancelar
document.getElementById('btnCancelarRechazo')?.addEventListener('click', () => {
    console.log('✅ CLIC EN CANCELAR FUNCIONÓ');
});

// Test si el modal está recibiendo clics
modal.addEventListener('click', (e) => {
    console.log('🖱️ Clic en modal - target:', e.target.id || e.target.tagName, '| cancelado?:', e.defaultPrevented, '| propagado?:', e.cancelBubble);
});

document.addEventListener('click', (e) => {
    console.log('📄 Clic en document - target:', e.target.id || e.target.tagName, '| cancelado?:', e.defaultPrevented);
}, { once: false, capture: true }); // capture:true = intercepta ANTES de todo
    
    // === VARIABLES LOCALES ===
    let motivoSeleccionado = null;
    
    // === REFERENCIAS A ELEMENTOS ===
    const btnCancelar = document.getElementById('btnCancelarRechazo');
    const btnAceptar = document.getElementById('btnAceptarRechazo');
    const motivosContainer = document.getElementById('motivos-container');
    const obsTextarea = document.getElementById('observacion-rechazo');
    
    // === FUNCIÓN DE VALIDACIÓN (declarada ANTES de usarla) ===
    function validarFormulario() {
        const observacion = obsTextarea?.value.trim() || '';
        
        if (!btnAceptar) return;
        
        if (motivoSeleccionado && observacion.length >= 5) {
            btnAceptar.disabled = false;
            btnAceptar.style.cursor = 'pointer';
            btnAceptar.style.background = '#007bff';
        } else {
            btnAceptar.disabled = true;
            btnAceptar.style.cursor = 'not-allowed';
            btnAceptar.style.background = '#ccc';
        }
    }
    
    // === EVENTO CANCELAR ===
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    // === EVENTO SELECCIÓN DE MOTIVO ===
    if (motivosContainer) {
        motivosContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-motivo-rechazo');
            if (!btn) return;
            
            motivoSeleccionado = btn.dataset.motivo;
            
            // Resaltar botón seleccionado
            document.querySelectorAll('.btn-motivo-rechazo').forEach(b => {
                if (b === btn) {
                    b.style.background = '#007bff';
                    b.style.color = 'white';
                } else {
                    b.style.background = '#f8f9fa';
                    b.style.color = 'black';
                }
            });
            
            validarFormulario();
        });
    }
    
    // === EVENTO OBSERVACIÓN ===
    if (obsTextarea) {
        obsTextarea.addEventListener('input', validarFormulario);
    }
    
    // === EVENTO ACEPTAR ===
    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            if (!motivoSeleccionado) {
                mostrarToast("Por favor, seleccione un motivo.", "error");
                return;
            }
            
            const observacion = obsTextarea?.value.trim() || '';
            if (observacion.length < 5) {
                mostrarToast("La observación debe tener al menos 5 caracteres.", "error");
                return;
            }
            
            // Cerrar modal antes de guardar
            modal.remove();
            
            // Llamar a guardar
            guardarRechazo(ordenId, motivoSeleccionado, observacion);
        });
    }
    
    // === CERRAR CON TECLA ESC ===
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // === CERRAR CLICKEANDO FUERA ===
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}


function validarObservacionRechazo() {
    const observacion = document.getElementById('observacion-rechazo')?.value.trim();
    const btnAceptar = document.getElementById('btnAceptarRechazo');
    if (!btnAceptar) return;
    if (observacion && observacion.length >= 5 && motivoSeleccionado) {
        btnAceptar.disabled = false;
        btnAceptar.style.cursor = 'pointer';
        btnAceptar.style.background = '#007bff';
    } else {
        btnAceptar.disabled = true;
        btnAceptar.style.cursor = 'not-allowed';
        btnAceptar.style.background = '#ccc';
    }
}

async function guardarRechazo(ordenId, motivoRechazo, observacionRechazo) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    try {
        const { error } = await supabase
            .from('ordenes')
            .update({
                estado: 'Rechazada',
                motivo_rechazo: motivoRechazo,
                observacion_rechazo: observacionRechazo
            })
            .eq('id', orden.id);

        if (error) throw error;

        // Actualizar en memoria
        orden.estado = 'Rechazada';
        orden.motivoRechazo = motivoRechazo;
        orden.observacionRechazo = observacionRechazo;

        mostrarToast(`Orden ${orden.numero} rechazada.`);
        cerrarModalRechazo();

        // ✅ Refrescar todas las vistas que podrían verse afectadas
        if (document.getElementById('panel-agendadas').classList.contains('active')) {
            aplicarFiltros(); // Quitar la orden de "Agendadas"
        }
        renderTablaRechazadas(); // Asegurar que aparezca en "Rechazadas"

    } catch (err) {
        console.error("Error al rechazar:", err);
        mostrarToast("Error al guardar el rechazo.", "error");
    }
}

function cerrarModalRechazo() {
    const modal = document.getElementById('modal-rechazo');
    if (modal) modal.remove();
    motivoSeleccionado = null;
}

// ==============================
// --- Paneles Liquidadas y Rechazadas ---
// ==============================
function renderTablaLiquidadas() {
    try {
        const tbody = document.querySelector('#panel-liquidadas #tabla-liquidadas tbody');
        const totalSpan = document.getElementById('total-liquidadas');
        const resumenDiv = document.getElementById('resumen-liquidadas');
        
        if (!tbody || !totalSpan) {
            console.error("❌ tbody o totalSpan no encontrado");
            return;
        }

        // ✅ OBTENER FECHAS DEL FILTRO (SIN AUTO-LLENADO)
        const inicio = document.getElementById('filtro-liquida-inicio')?.value;
        const fin = document.getElementById('filtro-liquida-fin')?.value;
        
        // ✅ SI NO HAY FECHAS, MOSTRAR MENSAJE Y SALIR (sin auto-llenar)
        if (!inicio || !fin) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;padding:30px;color:#6c757d;font-size:16px;">
                        <i class="fas fa-calendar-alt" style="font-size:2em;margin-bottom:10px;"></i><br>
                        Seleccione un rango de fechas (máx. 31 días) para ver las órdenes liquidadas
                    </td>
                </tr>`;
            
            totalSpan.textContent = '0';
            
            if (resumenDiv) {
                resumenDiv.innerHTML = `
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                        <p style="color: #6c757d; margin: 0;">Seleccione un rango de fechas para ver el resumen</p>
                    </div>`;
            }
            
            return; // ✅ SALIR SIN PROCESAR NADA
        }
        
        // ✅ VALIDAR RANGO MÁXIMO: 31 DÍAS
        const fechaInicio = parseFechaLocal(inicio);  // ✅ USAR parseFechaLocal para evitar UTC
        const fechaFin = parseFechaLocal(fin);         // ✅ USAR parseFechaLocal para evitar UTC
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);
        
        const diffTime = fechaFin - fechaInicio;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 31) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;padding:30px;color:#dc3545;font-size:16px;">
                        ⚠️ El rango máximo permitido es de <strong>31 días</strong>.<br>
                        Actualmente seleccionó <strong>${diffDays} días</strong>.<br><br>
                        <small>Por favor, filtre por periodos más cortos para optimizar el rendimiento.</small>
                    </td>
                </tr>`;
            totalSpan.textContent = '0';
            if (resumenDiv) resumenDiv.innerHTML = '';
            mostrarToast(`❌ Rango máximo: 31 días. Seleccione un periodo más corto.`, "error");
            return;
        }
        
        if (diffDays < 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;padding:30px;color:#dc3545;">
                        ❌ La fecha de inicio no puede ser posterior a la fecha de fin.
                    </td>
                </tr>`;
            totalSpan.textContent = '0';
            if (resumenDiv) resumenDiv.innerHTML = '';
            return;
        }
        
        // ✅ FILTRAR ÓRDENES LIQUIDADAS
        let liquidadas = ordenes.filter(o => o.estado === 'Liquidadas');
        
        // ✅ FILTRAR POR RANGO DE FECHAS (usando parseFechaLocal para consistencia)
        liquidadas = liquidadas.filter(o => {
            if (!o.fecha) return false;
            
            // Normalizar fecha de orden usando parseFechaLocal también
            const fechaOrden = parseFechaLocal(o.fecha.substring(0, 10));
            
            return fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
        });
        
        console.log(`✅ Liquidadas filtradas (${diffDays + 1} días): ${liquidadas.length} órdenes`);
        
        // ✅ CONTAR TIPOS DE SERVICIOS
        let conteoServicios = { INST: 0, VT: 0, UP: 0, TRAS: 0, otros: 0 };
        liquidadas.forEach(o => {
            const servicio = (o.servicio || '').toUpperCase();
            
            if (servicio.includes('INSTALACION') || servicio.includes('INST')) {
                conteoServicios.INST++;
            }
            else if (servicio.includes('VISITA') || servicio.includes('VT')) {
                conteoServicios.VT++;
            }
            // ✅ FIX: Agregar 'ADICIONAL' para que cuente como Upgrade
            else if (servicio.includes('UPGRADE') || servicio.includes('UP') || servicio.includes('ADICIONAL')) {
                conteoServicios.UP++;
            }
            else if (servicio.includes('TRASLADO') || servicio.includes('TRAS')) {
                conteoServicios.TRAS++;
            }
            else {
                conteoServicios.otros++;
            }
        });
        
        // ✅ RENDERIZAR RESUMEN
        if (resumenDiv) {
            resumenDiv.innerHTML = `
                <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h4 style="margin-top: 0; color: #002d5a; display: flex; align-items: center;">
                        <i class="fas fa-chart-bar" style="margin-right: 10px;"></i>
                        📊 Resumen de Servicios Liquidadas
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745;">
                            <strong style="font-size: 1.8em; color: #28a745; display: block;">${conteoServicios.INST}</strong>
                            <p style="margin: 8px 0 0 0; color: #495057; font-weight: 600;">Instalaciones (INST)</p>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #ffc107;">
                            <strong style="font-size: 1.8em; color: #ffc107; display: block;">${conteoServicios.VT}</strong>
                            <p style="margin: 8px 0 0 0; color: #495057; font-weight: 600;">Visitas Técnicas (VT)</p>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #17a2b8;">
                            <strong style="font-size: 1.8em; color: #17a2b8; display: block;">${conteoServicios.UP}</strong>
                            <p style="margin: 8px 0 0 0; color: #495057; font-weight: 600;">Upgrades (UP)</p>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #6c757d;">
                            <strong style="font-size: 1.8em; color: #6c757d; display: block;">${conteoServicios.TRAS}</strong>
                            <p style="margin: 8px 0 0 0; color: #495057; font-weight: 600;">Traslados (TRAS)</p>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #dc3545;">
                            <strong style="font-size: 1.8em; color: #dc3545; display: block;">${conteoServicios.otros}</strong>
                            <p style="margin: 8px 0 0 0; color: #495057; font-weight: 600;">Otros</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #002d5a, #0056b3); color: white; padding: 15px; border-radius: 8px; text-align: center;">
                            <strong style="font-size: 2em; display: block;">${conteoServicios.INST + conteoServicios.VT + conteoServicios.UP + conteoServicios.TRAS + conteoServicios.otros}</strong>
                            <p style="margin: 8px 0 0 0; font-weight: 600;">Total Servicios</p>
                        </div>
                    </div>
                </div>`;
        }
        
        // ✅ RENDERIZAR TABLA
        let html = '';
        liquidadas.forEach(o => {
            html += `
                <tr>
                    <td>${o.numero || '—'}</td>
                    <td>${o.fecha || '—'}</td>
                    <td>${o.nombre_cliente || '—'}</td>
                    <td>${o.rut_cliente || '—'}</td>
                    <td>${o.direccion || '—'}</td>
                    <td>${o.comuna || '—'}</td>
                    <td>${o.tecnico || '—'}</td>
                    <td>${o.servicio || '—'}</td>                
                </tr>`;
        });
        
        tbody.innerHTML = html || `
            <tr>
                <td colspan="8" style="text-align:center;padding:20px;color:#6c757d">
                    No hay órdenes liquidadas en el rango seleccionado
                </td>
            </tr>`;
        
        totalSpan.textContent = liquidadas.length;
        
    } catch (error) {
        console.error("❌ Error en renderTablaLiquidadas:", error);
        mostrarToast("Error al cargar órdenes liquidadas. Ver consola.", "error");
    }
}

function renderTablaRechazadas() {
    try {
        const tbody = document.querySelector("#tabla-rechazadas tbody");
        if (!tbody) return;
        
        // ✅ Motivos permitidos (solo estos se mostrarán)
        const motivosPermitidos = ["Sin moradores", "Orden mal generada", "Cliente rechaza"];
        
        // ✅ OBTENER FECHAS DEL FILTRO (SIN AUTO-LLENADO)
        const inicio = document.getElementById('filtro-rechazo-inicio')?.value;
        const fin = document.getElementById('filtro-rechazo-fin')?.value;
        
        // ✅ SI NO HAY FECHAS, MOSTRAR MENSAJE Y SALIR
        if (!inicio || !fin) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:30px;color:#6c757d;font-size:16px;">
                        <i class="fas fa-calendar-alt" style="font-size:2em;margin-bottom:10px;"></i><br>
                        Seleccione un rango de fechas (máx. 31 días) para ver las órdenes rechazadas
                    </td>
                </tr>`;
            return;
        }
        
        // ✅ VALIDAR RANGO MÁXIMO: 31 DÍAS (usando parseFechaLocal para evitar UTC)
        const fechaInicio = parseFechaLocal(inicio);  // ✅ CORRECCIÓN CLAVE
        const fechaFin = parseFechaLocal(fin);         // ✅ CORRECCIÓN CLAVE
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);
        
        const diffTime = fechaFin - fechaInicio;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 31) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:30px;color:#dc3545;font-size:16px;">
                        ⚠️ El rango máximo permitido es de <strong>31 días</strong>.<br>
                        Actualmente seleccionó <strong>${diffDays} días</strong>.<br><br>
                        <small>Por favor, filtre por periodos más cortos para optimizar el rendimiento.</small>
                    </td>
                </tr>`;
            mostrarToast(`❌ Rango máximo: 31 días. Seleccione un periodo más corto.`, "error");
            return;
        }
        
        if (diffDays < 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:30px;color:#dc3545;">
                        ❌ La fecha de inicio no puede ser posterior a la fecha de fin.
                    </td>
                </tr>`;
            return;
        }
        
        // ✅ FILTRAR ÓRDENES RECHAZADAS
        let rechazadas = ordenes.filter(o => o.estado === "Rechazada");
        
        // ✅ FILTRAR POR RANGO DE FECHAS (usando parseFechaLocal para consistencia)
        rechazadas = rechazadas.filter(o => {
            if (!o.fecha) return false;
            
            // Normalizar fecha de orden usando parseFechaLocal también
            const fechaOrden = parseFechaLocal(o.fecha.substring(0, 10));
            
            // Filtrar por motivo permitido también
            const motivo = o.motivo_rechazo || o.motivoRechazo || '';
            const motivoPermitido = motivosPermitidos.includes(motivo);
            
            return motivoPermitido && fechaOrden >= fechaInicio && fechaOrden <= fechaFin;
        });
        
        console.log(`✅ Rechazadas filtradas (${diffDays + 1} días): ${rechazadas.length} órdenes`);
        
        // ✅ RENDERIZAR TABLA
        tbody.innerHTML = "";
        
        if (rechazadas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:20px;color:#6c757d;">
                        No hay órdenes rechazadas con los motivos permitidos en el rango seleccionado
                    </td>
                </tr>`;
            return;
        }
        
        rechazadas.forEach(o => {
            const motivo = o.motivo_rechazo || o.motivoRechazo || '—';
            const observacion = o.observacion_rechazo || o.observacionRechazo || '';
            const motivoCompleto = observacion ? `${motivo} — ${observacion}` : motivo;
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><button class="btn-link-orden" data-numero="${o.numero}">${o.numero}</button></td>
                <td>${o.fecha}</td>
                <td>${o.nombre_cliente || '—'}</td>
                <td>${o.rut_cliente || '—'}</td>
                <td>${o.direccion || '—'}</td>
                <td>${o.tecnico || '—'}</td>
                <td>${motivoCompleto}</td>
            `;
            tbody.appendChild(tr);
        });
        
        // ✅ Conectar botones para reversar
        document.querySelectorAll('#panel-rechazadas .btn-link-orden').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const numero = btn.dataset.numero;
                reversarOrdenPorNumero(numero);
            });
        });
        
    } catch (error) {
        console.error("❌ Error en renderTablaRechazadas:", error);
        mostrarToast("Error al cargar órdenes rechazadas. Ver consola.", "error");
    }
}


function limpiarFiltroPorFecha(estado, renderFn) {
    const inicioEl = document.getElementById(`filtro-${estado.toLowerCase()}-inicio`);
    const finEl = document.getElementById(`filtro-${estado.toLowerCase()}-fin`);
    if (inicioEl) inicioEl.value = '';
    if (finEl) finEl.value = '';
    renderFn(); // Esto llamará a renderTablaLiquidadas, que ya está preparada para mostrar el mensaje vacío
}

function exportarExcelPorEstado(estado) {
    let inicio, fin;
    if (estado === 'Liquidadas') {
        inicio = document.getElementById('filtro-liquida-inicio')?.value;
        fin = document.getElementById('filtro-liquida-fin')?.value;
    } else if (estado === 'Rechazada') {
        inicio = document.getElementById('filtro-rechazo-inicio')?.value;
        fin = document.getElementById('filtro-rechazo-fin')?.value;
    }
    
    if (!inicio || !fin) {
        return mostrarToast(`Debe seleccionar un rango de fechas para exportar órdenes ${estado.toLowerCase()}.`, "error");
    }
    
    // ✅ VALIDACIÓN: MÁXIMO 31 DÍAS
    const fechaInicio = parseFechaLocal(inicio);
    const fechaFin = parseFechaLocal(fin);  
    const diffTime = fechaFin - fechaInicio;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 31) {
        return mostrarToast(`❌ El rango máximo permitido es de 31 días. Actualmente seleccionó ${diffDays} días.`, "error");
    }
    
    if (diffDays < 0) {
        return mostrarToast(`❌ La fecha de inicio no puede ser posterior a la fecha de fin.`, "error");
    }
    
    const datos = ordenes.filter(o =>
        o.estado === estado &&
        o.fecha >= inicio &&
        o.fecha <= fin
    );
    
    if (datos.length === 0) {
        return mostrarToast(`No hay órdenes ${estado.toLowerCase()} en el rango seleccionado.`, "error");
    }
    
    // ✅ Función auxiliar: asegura que el valor sea un array de strings
    function asegurarArray(valor) {
        if (!valor) return [];
        if (Array.isArray(valor)) {
            if (valor.length > 0 && typeof valor[0] === 'object' && valor[0] !== null) {
                return valor.map(item => item.serie || item.serie1 || '').filter(s => s);
            }
            return valor.filter(s => s);
        }
        return [String(valor)].filter(s => s);
    }
    
    // ✅ Define el orden EXACTO de las columnas (SIN tarjetas_retiradas separadas)
    const columnasOrdenadas = [
        "N° Orden",
        "Fecha",
        "Cliente",
        "RUT",
        "Dirección",
        "Comuna",
        "Técnico",
        "Servicio",
        "Observación",
        "Deco Entrada 1",
        "Deco Entrada 2",
        "Deco Entrada 3",
        "Deco Entrada 4",
        "Deco Entrada 5",
        "Tarjeta Entrada 1",
        "Tarjeta Entrada 2",
        "Tarjeta Entrada 3",
        "Tarjeta Entrada 4",
        "Tarjeta Entrada 5",
        "LNB Entrada 1",
        "Equipo/Tarjeta Retirado 1",
        "Equipo/Tarjeta Retirado 2",
        "Equipo/Tarjeta Retirado 3",
        "Equipo/Tarjeta Retirado 4",
        "Equipo/Tarjeta Retirado 5"
    ];
    
    // ✅ Genera los datos con las columnas en el orden correcto
    const ws_data = datos.map(o => {
        const row = {};
        // ✅ Primero, asigna los campos básicos
        row["N° Orden"] = o.numero;
        row["Fecha"] = o.fecha;
        row["Cliente"] = o.nombre_cliente || o.cliente || '—';
        row["RUT"] = o.rut_cliente || '—';
        row["Dirección"] = o.direccion || '—';
        row["Comuna"] = o.comuna || '—';
        row["Técnico"] = o.tecnico || '—';
        row["Servicio"] = `${o.servicio || '—'} → ${o.subservicio || '—'}`;
        row["Observación"] = o.observacion || o.observacion_liquidacion || '—';
        
        // ✅ Extraer arrays
        const decosEntrada = asegurarArray(o.series_entrada);
        const tarjetasEntrada = asegurarArray(o.series_tarjetas);
        const lnbsEntrada = asegurarArray(o.series_lnb);
        const equiposYTarjetasRetirados = asegurarArray(o.series_salida); // ✅ TODO en uno
        
        // ✅ Asigna cada serie a su columna específica (hasta 5)
        for (let i = 1; i <= 5; i++) {
            row[`Deco Entrada ${i}`] = decosEntrada[i - 1] || '';
            row[`Tarjeta Entrada ${i}`] = tarjetasEntrada[i - 1] || '';
            row[`LNB Entrada ${i}`] = lnbsEntrada[i - 1] || '';
            row[`Equipo/Tarjeta Retirado ${i}`] = equiposYTarjetasRetirados[i - 1] || ''; // ✅ Combinado
        }
        
        // ✅ Devuelve solo las columnas definidas en `columnasOrdenadas`
        const orderedRow = {};
        columnasOrdenadas.forEach(col => {
            orderedRow[col] = row[col] || '';
        });
        return orderedRow;
    });
    
    // ✅ Crea el libro y la hoja con el orden de columnas predefinido
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ws_data, { header: columnasOrdenadas });
    
    // ✅ Aplica ancho automático a las columnas
    const colWidths = {};
    ws_data.forEach(row => {
        Object.keys(row).forEach(key => {
            const len = String(row[key]).length;
            colWidths[key] = Math.max(colWidths[key] || 0, len);
        });
    });
    ws['!cols'] = columnasOrdenadas.map(key => ({ wch: Math.min(Math.max(colWidths[key] || 10, 10), 50) }));
    
    XLSX.utils.book_append_sheet(wb, ws, estado);
    XLSX.writeFile(wb, `Ordenes_${estado}_${inicio}_a_${fin}.xlsx`);
    
    mostrarToast(`✅ Exportadas ${datos.length} órdenes ${estado.toLowerCase()} (${diffDays + 1} días).`, "success");
}


function actualizarGraficoDesdePivot(pivotConfig) {
    const canvas = document.getElementById('grafico-tecnicos');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    if (graficoTecnicos) {
        graficoTecnicos.destroy();
        graficoTecnicos = null;
    }
    
    const pivotData = pivotConfig.data;
    const rowKeys = pivotData.getRowKeys();
    if (rowKeys.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const colKeys = pivotData.getColKeys();
    const labels = rowKeys.map(key => key.join('-') || 'Total');
    const datasets = colKeys.map((colKey) => {
        const label = colKey.join('-') || 'Total';
        const color = getColorForLabel(label);
        return {
            label: label,
            data: rowKeys.map(rowKey => pivotData.getAggregator(rowKey, colKey).value() || 0),
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
        };
    });
    graficoTecnicos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { 
                y: { beginAtZero: true, stacked: true, ticks: { stepSize: 1 } },
                x: { stacked: true }
            },
            plugins: {
                legend: { position: 'top' 
    },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
}

function getColorForLabel(label) {
    if (label.toLowerCase().includes('liquidada')) return { r: 40, g: 167, b: 69 };
    if (label.toLowerCase().includes('rechazada')) return { r: 220, g: 53, b: 69 };
    if (label.toLowerCase().includes('agendada')) return { r: 0, g: 123, b: 255 };
    
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
        hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    return {
        r: (hash & 0xFF0000) >> 16,
        g: (hash & 0x00FF00) >> 8,
        b: hash & 0x0000FF
    };
}

// ============================================
// --- Persistencia y Carga de Datos ---
// ============================================
function actualizarPersonal() {
    appData.personal.tecnicos = [];
    appData.personal.despacho = [];
    
    appData.empleados.forEach(emp => {
        if (emp.activo) {
            const cargo = appData.cargos.find(c => c.id === emp.cargoId);
            if (cargo) {
                const nombreCompleto = `${emp.nombre1} ${emp.apepaterno}`;
                if (cargo.nombre.toLowerCase().includes('tecnico') || cargo.nombre.toLowerCase().includes('técnico')) {
                    appData.personal.tecnicos.push(nombreCompleto);
                }
                if (cargo.nombre.toLowerCase().includes('despacho')) {
                    appData.personal.despacho.push(nombreCompleto);
                }
            }
        }
    });
    
    const despachoSelect = document.getElementById("orden-despacho");
    const tecnicoSelect = document.getElementById("orden-tecnico");
    
    if(despachoSelect) {
        populateSelect(despachoSelect, appData.personal.despacho.map(d => ({ value: d, text: d })), "Seleccione Despacho");
    }
    
    if(tecnicoSelect) {
        populateSelect(tecnicoSelect, appData.personal.tecnicos.map(t => ({ value: t, text: t })), "Seleccione Técnico");
        
        // ✅ AUTO-SELECCIONAR SI EL USUARIO ES TÉCNICO
        if (window.usuarioActivo) {
            const nombreUsuario = window.usuarioActivo.nombre;
            if (appData.personal.tecnicos.includes(nombreUsuario)) {
                tecnicoSelect.value = nombreUsuario;
                tecnicoSelect.disabled = true;  // ✅ Opcional: bloquear para que no lo cambien
            }
        }
    }
}

async function cargarDatos() {
    try {
        const [
        { data: articulos },
        { data: ingresos },
        { data: asignaciones },
        { data: usuarios },
        { data: empleados },
        { data: bodega_malos },
        { data: bodega_reversa }
        ] = await Promise.all([
        supabase.from('articulos').select('*'),
        supabase.from('ingresos').select('*'),
        supabase.from('asignaciones').select('*'),
        supabase.from('usuarios').select('*'),
        supabase.from('empleados').select('*'),
        supabase.from('bodega_malos').select('*'),
        supabase.from('bodega_reversa').select('*')
        ]);

        appData.bodegaMalos = (bodega_malos || []).map(item => ({
            ...item,
            estado_gestion: item.estado_gestion || 'pendiente',
            fecha_gestion: item.fecha_gestion || null,
            guia_devolucion: item.guia_devolucion || null,
            observacion_destino: item.observacion_destino || null
        }));

        appData.bodegaReversa = bodega_reversa || [];

        // ✅ Cargar artículos por tipo (incluyendo LNBs)
        appData.articulos = {
        seriados: articulos.filter(a => a.tipo === 'equipo'),
        ferreteria: articulos.filter(a => a.tipo === 'tarjeta'),
        lnbs: articulos.filter(a => a.tipo === 'lnb') // ✅ LNBs cargados correctamente
        };

        // ✅ Transformar ingresos a estructura esperada
        appData.ingresosSeriados = ingresos
        .filter(i => i.tipo === 'equipo')
        .map(i => ({
            ...i,
            equipos: (i.series || []).map(s => ({
            serie1: (typeof s === 'object' && s.serie1) ? s.serie1 : s,
            serie2: (typeof s === 'object' && s.serie2) ? s.serie2 : ''
            }))
        }));

        appData.ingresosTarjetas = ingresos
        .filter(i => i.tipo === 'tarjeta')
        .map(i => ({
            ...i,
            tarjetas: (i.series || []).map(s => ({
            serie: (typeof s === 'object' && s.serie) ? s.serie : s
            }))
        }));

        appData.ingresosLNB = ingresos
        .filter(i => i.tipo === 'lnb')
        .map(i => ({
            ...i,
            lnbs: (i.series || []).map(s => ({
            serie: (typeof s === 'object' && s.serie) ? s.serie : s
            }))
        }));

        // ✅ Reconstruir stock de empleados desde asignaciones
        appData.empleados = empleados.map(emp => {
        const stock = { equipos: [], tarjetas: [], lnbs: [] };
        const asignacionesEmpleado = asignaciones.filter(a => a.tecnico_id === emp.id);

        asignacionesEmpleado.forEach(asign => {
            if (!asign.series || !Array.isArray(asign.series)) return;

            if (asign.tipo === 'equipo') {
            asign.series.forEach(item => {
                const serie1 = (typeof item === 'object') ? (item.serie1 || '') : item;
                const serie2 = (typeof item === 'object') ? (item.serie2 || '') : '';
                if (serie1) {
                stock.equipos.push({
                    articuloCodigo: asign.articulo_codigo,
                    serie1,
                    serie2,
                    fechaAsignacion: asign.fecha,
                    guiaAsignacion: asign.guia_salida
                });
                }
            });
            } else if (asign.tipo === 'tarjeta' || asign.tipo === 'lnb') {
            const targetArray = asign.tipo === 'tarjeta' ? stock.tarjetas : stock.lnbs;
            asign.series.forEach(item => {
                const serie = (typeof item === 'object') ? (item.serie || item.serie1 || '') : item;
                if (serie) {
                targetArray.push({
                    articuloCodigo: asign.articulo_codigo,
                    serie,
                    fechaAsignacion: asign.fecha,
                    guiaAsignacion: asign.guia_salida
                });
                }
            });
            }
        });

        return {
        id: emp.id,
        rut: emp.rut,
        nombre1: emp.nombre1,
        nombre2: emp.nombre2 || '',
        apepaterno: emp.apepaterno,
        apematerno: emp.apematerno,
        cargoId: emp.cargo,
        telefono: emp.telefono || '',
        direccion: emp.direccion || '',
        region: emp.region || '',
        comuna: emp.comuna || '',
        email: emp.email || '',
        observacion: emp.observacion || '',
        fechaNacimiento: emp.fecha_nacimiento,
        fechaIngreso: emp.fecha_ingreso,
        fechaVencimientoLicencia: emp.fecha_vencimiento_licencia || null,
        activo: emp.activo,
        stock
        };
    });

    // Cargar otros datos
    appData.usuarios = usuarios || [];
    appData.bodegaMalos = bodega_malos || [];
    appData.bodegaReversa = bodega_reversa || [];
    renderListaUsuarios();

    // Crear usuario admin si no existe
    if (appData.usuarios.length === 0) {
        const admin = {
        id: 'usr-admin',
        rut: '11111111-1',
        nombre: 'Administrador',
        rol: 'admin',
        pass: '123456',
        fechacreacion: new Date().toISOString().split('T')[0]
        };
        await supabase.from('usuarios').insert([admin]);
        appData.usuarios.push(admin);
        console.log("✅ Usuario admin creado en Supabase");
    }

    console.log("✅ Logística y RRHH cargados desde Supabase");

    } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        // Inicializar estructuras vacías en caso de error
        appData.articulos = { seriados: [], ferreteria: [], lnbs: [] };
        appData.ingresosSeriados = [];
        appData.ingresosTarjetas = [];
        appData.ingresosLNB = [];
        appData.empleados = [];
        appData.usuarios = [];
        appData.bodegaMalos = [];
        appData.bodegaReversa = [];
    }

  // --- Cargos predeterminados ---
    const cargosRequeridos = [
        { id: 'cargo-tecnico', nombre: 'Técnico' },
        { id: 'cargo-despacho', nombre: 'Despacho' },
        { id: 'cargo-supervisor', nombre: 'Supervisor' },
        { id: 'cargo-enc-bodega', nombre: 'Encargado bodega' },
        { id: 'cargo-enc-rrhh', nombre: 'Encargado RRHH' },
        { id: 'cargo-jefatura', nombre: 'Jefatura' },
        { id: 'cargo-admin', nombre: 'Administrativo' }
    ];
    cargosRequeridos.forEach(c => {
        if (!appData.cargos.some(x => x.id === c.id)) {
        appData.cargos.push(c);
        }
    });

  // Asegurar stock en empleados
    appData.empleados.forEach(emp => {
        if (!emp.stock) emp.stock = { equipos: [], tarjetas: [], lnbs: [] };
        else if (!emp.stock.lnbs) emp.stock.lnbs = [];
    });

    // === Cargar órdenes (paginado con ordenamiento determinista) ===
    try {
        console.log('🔄 Iniciando carga de órdenes desde Supabase...');
        
        let todasLasOrdenes = [];
        let desde = 0;
        const tamañoPagina = 1000;
        let hayMas = true;
        let pagina = 1;

        while (hayMas) {
            console.log(`📄 Página ${pagina}: cargando desde ${desde}...`);
            
            // ✅ ORDENAMIENTO DETERMINISTA: fecha + id
            const { data, error, count } = await supabase
                .from('ordenes')
                .select('*', { count: 'exact' })
                .range(desde, desde + tamañoPagina - 1)
                .order('fecha', { ascending: false, nullsFirst: false })
                .order('id', { ascending: false }); // ← CLAVE: segundo criterio

            if (error) throw error;
            
            if (data && data.length > 0) {
                // ✅ Verificar duplicados por ID antes de concatenar
                const nuevosIds = new Set(data.map(o => o.id));
                const existentes = new Set(todasLasOrdenes.map(o => o.id));
                
                const sinDuplicados = data.filter(o => !existentes.has(o.id));
                todasLasOrdenes = [...todasLasOrdenes, ...sinDuplicados];
                
                console.log(`✅ Página ${pagina}: ${data.length} registros, ${sinDuplicados.length} nuevos (Total: ${todasLasOrdenes.length})`);
            }
            
            // Condición de parada segura
            hayMas = data.length === tamañoPagina && pagina < 20;
            desde += tamañoPagina;
            pagina++;
        }

        // Transformar y asignar a memoria local
        ordenes = todasLasOrdenes.map(o => ({
            ...o,
            rut: o.rut_cliente,
            nombre: o.nombre_cliente,
            nombreRecibe: o.nombre_recibe || o.persona_recibe || '',
            telefonoContacto: o.telefono_contacto || '',
            coordenadas: o.coordenadas || ''
        }));
        
        console.log(`🎉 Carga completa: ${ordenes.length} órdenes únicas en memoria`);
        
        // 🔍 DEBUG: Verificar las órdenes problemáticas
        const problematicas = ['145178-L', '147644-L', '147549-L', '88190-R'];
        console.log('\n🔍 Verificación de órdenes específicas:');
        problematicas.forEach(num => {
            const existe = ordenes.some(o => o.numero === num);
            const enSupa = existe ? '✅ EN MEMORIA' : '❌ NO CARGADA';
            console.log(`  ${num}: ${enSupa}`);
        });
        
    } catch (err) {
        console.error("❌ Error al cargar órdenes:", err);
        mostrarToast("Error al cargar órdenes. Ver consola.", "error");
        ordenes = [];
    }
    document.getElementById('btn-salir')?.addEventListener('click', cerrarSesion);

    // Actualizar listas de personal
    actualizarPersonal();
    construirMapaFormatoSeries();
}

// Mapa global para saber el formato correcto de cada serie
let mapaFormatoSeries = new Map();

function construirMapaFormatoSeries() {
    mapaFormatoSeries.clear();

    // Agregar series de Equipos (usan serie1)
    appData.ingresosSeriados?.forEach(ingreso => {
        (ingreso.series || []).forEach(s => {
            const serie = typeof s === 'object' ? s.serie1 || s.serie : s;
            if (serie) {
                mapaFormatoSeries.set(normalizarSerie(serie), 'equipo');
            }
        });
    });

    // Agregar series de Tarjetas (usan serie)
    appData.ingresosTarjetas?.forEach(ingreso => {
        (ingreso.series || []).forEach(s => {
            const serie = typeof s === 'object' ? s.serie || s.serie1 : s;
            if (serie) {
                mapaFormatoSeries.set(normalizarSerie(serie), 'tarjeta');
            }
        });
    });

    // Agregar series de LNBs (usan serie)
    appData.ingresosLNB?.forEach(ingreso => {
        (ingreso.series || []).forEach(s => {
            const serie = typeof s === 'object' ? s.serie || s.serie1 : s;
            if (serie) {
                mapaFormatoSeries.set(normalizarSerie(serie), 'lnb');
            }
        });
    });
}

// ─── SERIES CONSUMIDAS (instaladas en órdenes liquidadas) ───
function construirSetSeriesConsumidas() {
    const equipos = new Set();
    const tarjetas = new Set();
    const lnbs = new Set();
 
    ordenes.forEach(o => {
        if (o.estado !== 'Liquidadas') return;
 
        // series_entrada → equipos
        (o.series_entrada || [])
            .filter(s => s !== null && s !== undefined)
            .forEach(s => {
                const val = typeof s === 'object' ? (s.serie1 || s.serie) : s;
                if (val) equipos.add(normalizarSerie(val));
            });
 
        // series_tarjetas → tarjetas
        (o.series_tarjetas || [])
            .filter(s => s !== null && s !== undefined)
            .forEach(s => {
                const val = typeof s === 'object' ? (s.serie || s.serie1) : s;
                if (val) tarjetas.add(normalizarSerie(val));
            });
 
        // series_lnb → lnbs
        (o.series_lnb || [])
            .filter(s => s !== null && s !== undefined)
            .forEach(s => {
                const val = typeof s === 'object' ? (s.serie || s.serie1) : s;
                if (val) lnbs.add(normalizarSerie(val));
            });
    });
 
    return { equipos, tarjetas, lnbs };
}

// ============================================
// --- Funciones Auxiliares y Arranque ---
// ============================================
function populateSelect(selectElement, optionsArray, placeholder) {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
    optionsArray.forEach(item => {
        let opt = document.createElement("option");
        opt.value = typeof item === 'object' ? item.value : item;
        opt.textContent = typeof item === 'object' ? item.text : item;
        selectElement.appendChild(opt);
    });
}

// ============================================
// --- Funciones Ingreso articulo ---
// ============================================
// ============================================
// --- PANEL: GESTIÓN EQUIPOS Y TARJETAS ---
// ============================================

function mostrarFormularioCreacion(tipo) {
    document.getElementById('tipo-articulo').value = tipo;
    // Mostrar formulario
    const form = document.getElementById('form-crear-articulo');
    form.style.display = 'block';
    // Scroll suave hacia el formulario
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelarCreacion() {
    document.getElementById('form-crear-articulo').style.display = 'none';
    document.getElementById('form-crear-articulo').reset();
}

async function guardarArticulo(event) {
    event.preventDefault();
    const tipo = document.getElementById('tipo-articulo').value;
    const nombre = document.getElementById('articulo-nombre').value.trim();
    const codigo = document.getElementById('articulo-codigo').value.trim();
    if (!nombre || !codigo) return mostrarToast("Nombre y código son obligatorios.", "error");
    
    let lista;
    if (tipo === 'seriado') {
        lista = appData.articulos.seriados;
    } else if (tipo === 'ferreteria') {
        lista = appData.articulos.ferreteria;
    } else if (tipo === 'lnb') {
        lista = appData.articulos.lnbs;
    } else {
        return mostrarToast("Tipo de artículo no válido.", "error");
    }
    if (lista.some(a => a.codigo === codigo)) {
        return mostrarToast("El código ya existe. Debe ser único.", "error");
    }
    
    // Agregar nuevo artículo con estado activo
    lista.push({ nombre, codigo, activo: true });

    await supabase.from('articulos').insert([
        {
            codigo: codigo,
            nombre: nombre,
            tipo: tipo, // 'equipo', 'tarjeta' o 'lnb'
            activo: true
        }
    ]);
    mostrarToast(`✅ Artículo ${tipo} guardado con éxito.`);
    
    // Reset y renderizar tabla
    document.getElementById('form-crear-articulo').reset();
    document.getElementById('form-crear-articulo').style.display = 'none';
    renderGestionEquipos();
}

function renderGestionEquipos() {
    const tbody = document.querySelector('#tabla-gestion-articulos tbody');
    if (!tbody) return;
    
    const todosArticulos = [
        ...appData.articulos.seriados.map(a => ({ ...a, tipo: 'Equipo' })),
        ...appData.articulos.ferreteria.map(a => ({ ...a, tipo: 'Tarjeta' })),
        ...(appData.articulos.lnbs || []).map(a => ({ ...a, tipo: 'LNB' }))
    ];

    if (todosArticulos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay artículos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = todosArticulos.map(art => `
        <tr>
            <td>${art.tipo}</td>
            <td>${art.nombre || '—'}</td>
            <td>${art.codigo || '—'}</td>
            <td>
                <button class="btn-editar-articulo" 
                        data-id="${art.codigo}" 
                        data-tipo="${art.tipo.toLowerCase()}"
                        style="background:orange; color:black; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.9em; margin-right:5px;">
                    ✏️ Editar
                </button>
                <button class="btn-eliminar-articulo" 
                        data-id="${art.codigo}" 
                        data-tipo="${art.tipo.toLowerCase()}"
                        style="background:#dc3545; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.9em;">
                    ❌ Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // ✅ Asignar listeners después de renderizar
    tbody.querySelectorAll('.btn-editar-articulo').forEach(btn => {
        btn.onclick = () => {
            const tipo = btn.dataset.tipo;
            const codigo = btn.dataset.id;
            const origenMap = { equipo: 'seriados', tarjeta: 'ferreteria', lnb: 'lnbs' };
            const origen = origenMap[tipo];
            const articulo = appData.articulos[origen]?.find(a => a.codigo === codigo);
            if (!articulo) return;

            const form = document.getElementById('form-crear-articulo');
            form.style.display = 'block';
            document.getElementById('articulo-nombre').value = articulo.nombre || '';
            document.getElementById('articulo-codigo').value = articulo.codigo;
            document.getElementById('articulo-codigo').disabled = true;
            document.getElementById('tipo-articulo').value = tipo === 'equipo' ? 'seriado' : tipo === 'tarjeta' ? 'ferreteria' : 'lnb';
            
            // Campos nuevos (si existen en el HTML)
            const elOp = document.getElementById('articulo-operador'); if(elOp) elOp.value = articulo.operador || 'Claro';
            const elTec = document.getElementById('articulo-tecnologia'); if(elTec) elTec.value = articulo.tecnologia || 'GPON';

            form.dataset.editando = codigo;
            form.dataset.origen = origen;
            form.querySelector('button[type="submit"]').textContent = '💾 Actualizar Artículo';
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
    });

    tbody.querySelectorAll('.btn-eliminar-articulo').forEach(btn => {
        btn.onclick = () => {
            const tipo = btn.dataset.tipo;
            const codigo = btn.dataset.id;
            const origenMap = { equipo: 'seriados', tarjeta: 'ferreteria', lnb: 'lnbs' };
            deshabilitarArticulo(codigo, origenMap[tipo]);
        };
    });
}

document.getElementById('form-crear-articulo')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editando = this.dataset.editando;
    
    // ✅ Capturar campos nuevos (operador y tecnología)
    const operador = document.getElementById('articulo-operador')?.value || 'Claro';
    const tecnologia = document.getElementById('articulo-tecnologia')?.value || 'Fibra'; // ✅ Default Fibra

    if (editando) {
        // --- MODO EDICIÓN ---
        const origen = this.dataset.origen;
        const codigo = editando;
        const nuevoNombre = document.getElementById('articulo-nombre').value.trim();
        
        if (!nuevoNombre) return mostrarToast("El nombre no puede estar vacío.", "error");
        
        const lista = appData.articulos[origen];
        const index = lista.findIndex(a => a.codigo === codigo);
        
        if (index !== -1) {
            // Actualizar en memoria con nuevos campos
            lista[index].nombre = nuevoNombre;
            lista[index].operador = operador;
            lista[index].tecnologia = tecnologia;

            // ✅ MAPEO CORREGIDO: Solo 2 tipos válidos
            const tipoMap = { 
                'seriados': 'equipo', 
                'ferreteria': 'ferreteria'  // ✅ Cambiado: ya no es 'tarjeta'
                // ❌ 'lnbs' eliminado completamente
            };
            const tipoSupabase = tipoMap[origen];
            if (!tipoSupabase) return mostrarToast("Tipo de artículo no válido.", "error");

            // ✅ UPDATE con nuevos campos
            const { error } = await supabase
                .from('articulos')
                .update({ 
                    nombre: nuevoNombre,
                    operador: operador,
                    tecnologia: tecnologia  // ✅ Nuevo campo
                })
                .eq('codigo', codigo)
                .eq('tipo', tipoSupabase);

            if (error) {
                console.error("Error al actualizar:", error);
                return mostrarToast("Error al guardar en la nube.", "error");
            }

            mostrarToast("✅ Artículo actualizado con éxito.");
            this.style.display = 'none';
            delete this.dataset.editando;
            delete this.dataset.origen;
            this.querySelector('button[type="submit"]').textContent = '💾 Guardar Artículo';
            this.querySelector('#articulo-codigo').disabled = false;
            this.reset();
            renderGestionEquipos();
        }
        
    } else {
        // --- MODO CREACIÓN ---
        const tipoForm = document.getElementById('tipo-articulo').value;
        const nombre = document.getElementById('articulo-nombre').value.trim();
        const codigo = document.getElementById('articulo-codigo').value.trim();
        
        if (!nombre || !codigo) return mostrarToast("Nombre y código son obligatorios.", "error");

        // ✅ MAPEO CORREGIDO: Solo 2 tipos válidos
        const tipoMap = { 
            'seriado': 'equipo', 
            'ferreteria': 'ferreteria'  // ✅ Cambiado: ya no es 'tarjeta'
            // ❌ 'lnb' eliminado completamente
        };
        const tipoSupabase = tipoMap[tipoForm];
        if (!tipoSupabase) return mostrarToast("Tipo de artículo no válido.", "error");

        // ✅ Seleccionar array correcto (sin lnbs)
        let lista = appData.articulos[ 
            tipoForm === 'seriado' ? 'seriados' : 'ferreteria'
        ];

        if (lista.some(a => a.codigo === codigo)) {
            return mostrarToast("El código ya existe. Debe ser único.", "error");
        }

        // ✅ Guardar en memoria con nuevos campos
        lista.push({ 
            nombre, 
            codigo, 
            activo: true,
            operador,      // ✅ Nuevo
            tecnologia     // ✅ Nuevo
        });

        // ✅ Guardar en Supabase con nuevos campos
        const { error } = await supabase
            .from('articulos')
            .insert([{ 
                codigo, 
                nombre, 
                tipo: tipoSupabase, 
                activo: true,
                operador,      // ✅ Nuevo campo en BD
                tecnologia     // ✅ Nuevo campo en BD
            }]);

        if (error) {
            console.error("Error al insertar:", error);
            return mostrarToast("Error al guardar en la nube.", "error");
        }

        mostrarToast(`✅ Artículo ${tipoForm} guardado con éxito.`);
        this.reset();
        this.style.display = 'none';
        renderGestionEquipos();
    }
});

async function deshabilitarArticulo(codigo, origen) {
    // Crear modal personalizado
    const modal = document.createElement('div');
    modal.id = 'modal-deshabilitar-articulo';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(3px);
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            text-align: center;
        ">
            <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <h3 style="margin: 0 0 15px; color: #1e293b; font-size: 20px;">
                ¿Deshabilitar artículo?
            </h3>
            <p style="color: #64748b; margin-bottom: 10px; font-size: 15px;">
                Artículo: <strong style="color: #007bff;">"${codigo}"</strong>
            </p>
            <p style="color: #94a3b8; font-size: 13px; margin-bottom: 25px;">
                Dejará de aparecer en asignaciones pero se mantendrá en el historial.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="btn-cancelar-deshabilitar" style="
                    padding: 10px 24px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s;
                ">Cancelar</button>
                <button id="btn-confirmar-deshabilitar" style="
                    padding: 10px 24px;
                    border: none;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                    transition: all 0.2s;
                ">🚫 Deshabilitar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    return new Promise((resolve) => {
        const btnCancelar = document.getElementById('btn-cancelar-deshabilitar');
        const btnConfirmar = document.getElementById('btn-confirmar-deshabilitar');
        
        const cerrarModal = () => {
            modal.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                modal.remove();
            }, 200);
            resolve(false);
        };
        
        btnCancelar.onclick = cerrarModal;
        
        btnConfirmar.onclick = async () => {
            modal.remove();
            
            // Lógica de deshabilitación
            const articulo = appData.articulos[origen].find(a => a.codigo === codigo);
            if (!articulo) {
                mostrarToast("❌ Artículo no encontrado.", "error");
                resolve(false);
                return;
            }
            
            const tipoMap = {
                'seriados': 'equipo',
                'ferreteria': 'tarjeta',
                'lnbs': 'lnb'
            };
            const tipo = tipoMap[origen];
            
            if (!tipo) {
                mostrarToast("⚠️ Tipo de artículo no reconocido.", "error");
                resolve(false);
                return;
            }
            
            try {
                const { error } = await supabase
                    .from('articulos')
                    .update({ activo: false })
                    .eq('codigo', codigo)
                    .eq('tipo', tipo);
                
                if (error) throw error;
                
                articulo.activo = false;
                mostrarToast("✅ Artículo deshabilitado correctamente.", "success");
                renderGestionEquipos();
                resolve(true);
            } catch (err) {
                console.error("❌ Error al deshabilitar:", err);
                mostrarToast("Error al deshabilitar en la nube.", "error");
                resolve(false);
            }
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) cerrarModal();
        };
    });
}

async function habilitarArticulo(codigo, origen) {
    const articulo = appData.articulos[origen].find(a => a.codigo === codigo);
    if (!articulo) return;

    // ✅ Mapear el "origen" a "tipo" para Supabase
    const tipoMap = {
        'seriados': 'equipo',
        'ferreteria': 'tarjeta',
        'lnbs': 'lnb'
    };
    const tipo = tipoMap[origen];

    if (!tipo) {
        mostrarToast("⚠️ Tipo de artículo no reconocido.", "error");
        return;
    }

    try {
        // ✅ ACTUALIZAR en Supabase (no insertar)
        const { error } = await supabase
            .from('articulos')
            .update({ activo: true })
            .eq('codigo', codigo)
            .eq('tipo', tipo);

        if (error) throw error;

        // ✅ Actualizar en memoria
        articulo.activo = true;

        mostrarToast("✅ Artículo habilitado.");
        renderGestionEquipos();
    } catch (err) {
        console.error("❌ Error al habilitar en Supabase:", err);
        mostrarToast("Error al habilitar el artículo en la nube.", "error");
    }
}

// =======================================================
// === PANEL: GESTIÓN BODEGA MALO ===
// =======================================================

/**
 * Renderiza la tabla de equipos en Bodega Malo con opciones de gestión
 */
function renderGestionBodegaMalo() {
    const tbody = document.querySelector('#tabla-bodega-malo-gestion tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;">⏳ Cargando equipos...</td></tr>';
    
    try {
        const datos = appData.bodegaMalos || [];
        
        if (datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:40px;">📦 No hay equipos en Bodega Malo</td></tr>';
            return;
        }
        
        let html = '';
        datos.forEach((eq, index) => {
            const estado = eq.estado_gestion || 'pendiente';
            const fechaDevolucion = eq.fecha_devolucion || eq.fecha || '—';
            const serie = eq.serie1 || '—';
            const serie2 = eq.serie2 ? ` / ${eq.serie2}` : '';
            
            let filaColor = '#fff';
            let estadoLabel = '⏳ Pendiente';
            let estadoColor = '#ffc107';
            
            if (estado === 'reintegrado') {
                filaColor = '#d4edda';
                estadoLabel = '✅ Reintegrado';
                estadoColor = '#28a745';
            } else if (estado === 'devuelto_mandante') {
                filaColor = '#f8d7da';
                estadoLabel = '📤 Devuelto Mandante';
                estadoColor = '#dc3545';
            }
            
            html += `
            <tr style="background:${filaColor};border-bottom:1px solid #ddd;">
                <td style="padding:12px;">${eq.articulo_nombre || eq.articulo_codigo || '—'}</td>
                <td style="padding:12px;font-family:monospace;">${serie}${serie2}</td>
                <td style="padding:12px;">${eq.tecnico || '—'}</td>
                <td style="padding:12px;">${fechaDevolucion}</td>
                <td style="padding:12px;">${eq.observacion || '—'}</td>
                <td style="padding:12px;text-align:center;">
                    <span style="background:${estadoColor};color:white;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;">
                        ${estadoLabel}
                    </span>
                </td>
                <td style="padding:12px;text-align:center;">
                    ${estado === 'pendiente' ? `
                    <button onclick="abrirModalDestinoBodegaMalo('${eq.id || index}')" 
                            style="background:#007bff;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;margin-right:5px;"
                            title="Definir destino">
                        🎯 Destino
                    </button>` : `<span style="color:#666;font-size:12px;">${eq.fecha_gestion || '—'}</span>`}
                </td>
                <td style="padding:12px;text-align:center;">
                    <button onclick="verDetalleBodegaMalo('${eq.id || index}')" 
                            style="background:#6c757d;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;"
                            title="Ver detalle">
                        👁️ Ver
                    </button>
                </td>
            </tr>`;
        });
        
        tbody.innerHTML = html;
        
        // ✅ ACTUALIZAR CONTADORES (CORREGIDO)
        const pendientes = datos.filter(d => !d.estado_gestion || d.estado_gestion === 'pendiente').length;
        const reintegrados = datos.filter(d => d.estado_gestion === 'reintegrado').length;
        const devueltos = datos.filter(d => d.estado_gestion === 'devuelto_mandante').length;
        
        // ✅ Forma segura de asignar:
        const elPendientes = document.getElementById('total-malos-pendientes');
        const elReintegrados = document.getElementById('total-malos-reintegrados');
        const elDevueltos = document.getElementById('total-malos-devueltos');
        
        if (elPendientes) elPendientes.textContent = pendientes;
        if (elReintegrados) elReintegrados.textContent = reintegrados;
        if (elDevueltos) elDevueltos.textContent = devueltos;
        
    } catch (err) {
        console.error('❌ Error en renderGestionBodegaMalo:', err);
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#dc3545;padding:20px;">Error al cargar datos</td></tr>';
    }
}

/**
 * Abre modal para seleccionar destino del equipo
 */
function abrirModalDestinoBodegaMalo(equipoId) {
    const equipo = appData.bodegaMalos.find(e => (e.id || appData.bodegaMalos.indexOf(e)) == equipoId);
    if (!equipo) return mostrarToast('❌ Equipo no encontrado', 'error');
    
    // Crear modal
    const modalExistente = document.getElementById('modal-destino-bodega-malo');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.id = 'modal-destino-bodega-malo';
    modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.5);z-index:9999;
        display:flex;align-items:center;justify-content:center;
    `;
    
    modal.innerHTML = `
    <div style="background:white;padding:30px;border-radius:12px;max-width:500px;width:90%;box-shadow:0 8px 30px rgba(0,0,0,0.2);">
        <h3 style="margin:0 0 20px;color:#002244;text-align:center;">🎯 Definir Destino del Equipo</h3>
        
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">
            <p style="margin:5px 0;"><strong>Artículo:</strong> ${equipo.articulo_nombre || equipo.articulo_codigo || '—'}</p>
            <p style="margin:5px 0;"><strong>Serie:</strong> ${equipo.serie1 || '—'}${equipo.serie2 ? ' / ' + equipo.serie2 : ''}</p>
            <p style="margin:5px 0;"><strong>Técnico:</strong> ${equipo.tecnico || '—'}</p>
            <p style="margin:5px 0;"><strong>Fecha Devolución:</strong> ${equipo.fecha_devolucion || equipo.fecha || '—'}</p>
            ${equipo.observacion ? `<p style="margin:5px 0;"><strong>Observación:</strong> ${equipo.observacion}</p>` : ''}
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:10px;font-weight:600;color:#333;">Seleccione el destino:</label>
            
            <div style="display:flex;flex-direction:column;gap:10px;">
                <label style="display:flex;align-items:flex-start;gap:10px;padding:15px;border:2px solid #007bff;border-radius:8px;cursor:pointer;background:#f0f7ff;">
                    <input type="radio" name="destino-bodega-malo" value="reintegrar" checked style="margin-top:3px;">
                    <div>
                        <strong style="color:#007bff;">🔄 Reintegrar a Stock</strong>
                        <p style="margin:5px 0 0 0;font-size:13px;color:#666;">
                            El equipo vuelve a bodega principal y puede ser asignado a técnicos nuevamente.
                        </p>
                    </div>
                </label>
                
                <label style="display:flex;align-items:flex-start;gap:10px;padding:15px;border:2px solid #dc3545;border-radius:8px;cursor:pointer;background:#fff5f5;">
                    <input type="radio" name="destino-bodega-malo" value="devolver_mandante" style="margin-top:3px;">
                    <div>
                        <strong style="color:#dc3545;">📤 Devolver a Empresa Mandante</strong>
                        <p style="margin:5px 0 0 0;font-size:13px;color:#666;">
                            El equipo se prepara para devolución al proveedor/mandante. Requiere guía de despacho.
                        </p>
                    </div>
                </label>
            </div>
        </div>
        
        <div id="campo-guia-devolucion" style="display:none;margin-bottom:20px;">
            <label style="display:block;margin-bottom:5px;font-weight:600;color:#333;">N° Guía de Devolución:</label>
            <input type="text" id="guia-devolucion-mandante" placeholder="Ej: GD-2024-001" 
                   style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:5px;font-weight:600;color:#333;">Observación (opcional):</label>
            <textarea id="observacion-destino-malo" placeholder="Detalle adicional..." 
                      style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;min-height:80px;"></textarea>
        </div>
        
        <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button onclick="document.getElementById('modal-destino-bodega-malo').remove()" 
                    style="padding:10px 20px;border:1px solid #ddd;background:white;color:#666;border-radius:6px;cursor:pointer;">
                Cancelar
            </button>
            <button onclick="confirmarDestinoBodegaMalo('${equipo.id || equipoId}')" 
                    style="padding:10px 20px;border:none;background:#007bff;color:white;border-radius:6px;cursor:pointer;font-weight:600;">
                ✅ Confirmar Destino
            </button>
        </div>
    </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar campo de guía solo si selecciona "devolver_mandante"
    modal.querySelectorAll('input[name="destino-bodega-malo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const campoGuia = document.getElementById('campo-guia-devolucion');
            if (campoGuia) {
                campoGuia.style.display = this.value === 'devolver_mandante' ? 'block' : 'none';
            }
        });
    });
}

/**
 * Confirma el destino seleccionado para el equipo
 */
async function confirmarDestinoBodegaMalo(equipoId) {
    const destino = document.querySelector('input[name="destino-bodega-malo"]:checked')?.value;
    const guiaDevolucion = document.getElementById('guia-devolucion-mandante')?.value.trim();
    const observacion = document.getElementById('observacion-destino-malo')?.value.trim();
    
    if (!destino) return mostrarToast('⚠️ Seleccione un destino', 'warning');
    
    if (destino === 'devolver_mandante' && !guiaDevolucion) {
        return mostrarToast('⚠️ Ingrese el N° de guía para devolución', 'warning');
    }
    
    try {
        const equipoIndex = appData.bodegaMalos.findIndex(e => (e.id || appData.bodegaMalos.indexOf(e)) == equipoId);
        if (equipoIndex === -1) throw new Error('Equipo no encontrado');
        
        const equipo = appData.bodegaMalos[equipoIndex];
        
        // Actualizar en memoria local
        appData.bodegaMalos[equipoIndex] = {
            ...equipo,
            estado_gestion: destino,
            fecha_gestion: new Date().toISOString().split('T')[0],
            guia_devolucion: destino === 'devolver_mandante' ? guiaDevolucion : null,
            observacion_destino: observacion || equipo.observacion
        };
        
        // Guardar en Supabase
        const { error } = await supabase
            .from('bodega_malos')
            .update({
                estado_gestion: destino,
                fecha_gestion: new Date().toISOString().split('T')[0],
                guia_devolucion: destino === 'devolver_mandante' ? guiaDevolucion : null,
                observacion_destino: observacion || null
            })
            .eq('id', equipo.id);
        
        if (error) throw error;
        
        // Si es reintegrar, agregar al stock de bodega
        if (destino === 'reintegrar') {
            await registrarBitacora(
                'reintegro_bodega_malo',
                `Equipo ${equipo.serie1} reintegrado a stock`,
                `Artículo: ${equipo.articulo_codigo} | Técnico original: ${equipo.tecnico}`
            );
            mostrarToast('✅ Equipo reintegrado a stock de bodega', 'success');
        } else {
            await registrarBitacora(
                'devolucion_mandante',
                `Equipo ${equipo.serie1} preparado para devolución`,
                `Guía: ${guiaDevolucion} | Artículo: ${equipo.articulo_codigo}`
            );
            mostrarToast('✅ Equipo marcado para devolución al mandante', 'success');
        }
        
        document.getElementById('modal-destino-bodega-malo').remove();
        renderGestionBodegaMalo();
        
    } catch (err) {
        console.error('❌ Error al confirmar destino:', err);
        mostrarToast('❌ Error al procesar: ' + err.message, 'error');
    }
}

/**
 * Ver detalle de un equipo en Bodega Malo
 */
function verDetalleBodegaMalo(equipoId) {
    const equipo = appData.bodegaMalos.find(e => (e.id || appData.bodegaMalos.indexOf(e)) == equipoId);
    if (!equipo) return mostrarToast('❌ Equipo no encontrado', 'error');
    
    alert(`📦 DETALLE DEL EQUIPO\n\n` +
          `Artículo: ${equipo.articulo_nombre || equipo.articulo_codigo}\n` +
          `Serie: ${equipo.serie1}${equipo.serie2 ? ' / ' + equipo.serie2 : ''}\n` +
          `Técnico: ${equipo.tecnico}\n` +
          `Fecha Devolución: ${equipo.fecha_devolucion}\n` +
          `Observación: ${equipo.observacion || '—'}\n` +
          `Estado Gestión: ${equipo.estado_gestion || 'Pendiente'}\n` +
          `Guía Devolución: ${equipo.guia_devolucion || '—'}`
    );
}

/**
 * Exportar Bodega Malo a Excel
 */
function exportarBodegaMaloExcel() {
    const datos = appData.bodegaMalos || [];
    
    if (datos.length === 0) {
        return mostrarToast('⚠️ No hay equipos para exportar', 'warning');
    }
    
    const datosExcel = datos.map(eq => ({
        'Artículo': eq.articulo_nombre || eq.articulo_codigo || '—',
        'Serie 1': eq.serie1 || '—',
        'Serie 2': eq.serie2 || '—',
        'Técnico': eq.tecnico || '—',
        'Fecha Devolución': eq.fecha_devolucion || eq.fecha || '—',
        'Observación': eq.observacion || '—',
        'Estado Gestión': eq.estado_gestion || 'Pendiente',
        'Guía Devolución': eq.guia_devolucion || '—',
        'Fecha Gestión': eq.fecha_gestion || '—'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    
    ws['!cols'] = [
        { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 25 },
        { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Bodega_Malo');
    XLSX.writeFile(wb, `Bodega_Malo_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    mostrarToast(`✅ Exportados ${datosExcel.length} equipos`, 'success');
}

function procesarExcelEquipos(file, articuloCodigo) { 
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const articulo = appData.articulos.seriados.find(a => a.codigo === articuloCodigo);
                if (!articulo) {
                    return reject(`[Error PEX] Código de artículo no encontrado: ${articuloCodigo}`);
                }
                if (json.length < 2) return reject("Archivo vacío o sin datos.");
                const headers = json[0].map(h => h?.toString().trim().toLowerCase());
                let equipos = [];
                if (headers.includes('serie1') && headers.includes('serie2')) {
                    const idxSerie1 = headers.findIndex(h => h === 'serie1');
                    const idxSerie2 = headers.findIndex(h => h === 'serie2');
                    
                    equipos = json.slice(1).map(row => ({
                        codigo: articuloCodigo,
                        nombreArticulo: articulo.nombre,
                        serie1: row[idxSerie1]?.toString().trim() || '',
                        serie2: row[idxSerie2]?.toString().trim() || ''
                    })).filter(eq => eq.serie1 || eq.serie2);
                } else {
                    equipos = json.slice(1).map(row => ({
                        codigo: articuloCodigo,
                        nombreArticulo: articulo.nombre,
                        serie1: row[0]?.toString().trim() || '', 
                        serie2: row[1]?.toString().trim() || ''
                    })).filter(eq => eq.serie1 || eq.serie2);
                }
                if (equipos.length === 0) return reject("No se encontraron series válidas en el archivo.");
                resolve(equipos);
            } catch (err) {
                reject(err.message || "Error al leer el archivo Excel.");
            }
        };
        reader.onerror = () => reject("Error al cargar el archivo.");
        reader.readAsArrayBuffer(file);
    });
}
function procesarExcelTarjetas(file, articuloCodigo) { 
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const articulo = appData.articulos.ferreteria.find(a => a.codigo === articuloCodigo);
                if (!articulo) {
                    return reject(`[Error PTJ] Código de artículo no encontrado: ${articuloCodigo}`);
                }
                if (json.length < 2) return reject("Archivo vacío o sin datos.");
                const headers = json[0].map(h => h?.toString().trim().toLowerCase());
                let tarjetas = [];
                if (headers.includes('serie') || headers.includes('codigo')) {
                    const idxSerie = headers.findIndex(h => h === 'serie' || h === 'codigo');
                    
                    tarjetas = json.slice(1).map(row => ({
                        codigo: articuloCodigo,
                        nombreArticulo: articulo.nombre,
                        serie: row[idxSerie]?.toString().trim() || ''
                    })).filter(t => t.serie);
                } else {
                    tarjetas = json.slice(1).map(row => ({
                        codigo: articuloCodigo, 
                        nombreArticulo: articulo.nombre,
                        serie: row[0]?.toString().trim() || ''
                    })).filter(t => t.serie);
                }

                if (tarjetas.length === 0) return reject("No se encontraron series válidas.");

                resolve(tarjetas);
            } catch (err) {
                reject(err.message || "Error al leer el archivo Excel.");
            }
        };
        reader.onerror = () => reject("Error al cargar el archivo.");
        reader.readAsArrayBuffer(file);
    });
}

function procesarExcelLNB(file, articuloCodigo) { 
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const articulo = appData.articulos.lnbs.find(a => a.codigo === articuloCodigo);
                if (!articulo) {
                    return reject(`[Error LNB] Código de artículo no encontrado: ${articuloCodigo}`);
                }
                if (json.length < 2) return reject("Archivo vacío o sin datos.");

                const headers = json[0].map(h => h?.toString().trim().toLowerCase());
                let lnbs = [];

                // Buscar columna "serie" o "codigo"
                if (headers.includes('serie') || headers.includes('codigo')) {
                    const idxSerie = headers.findIndex(h => h === 'serie' || h === 'codigo');
                    lnbs = json.slice(1).map(row => ({
                        codigo: articuloCodigo,
                        nombreArticulo: articulo.nombre,
                        serie: row[idxSerie]?.toString().trim() || ''
                    })).filter(t => t.serie);
                } else {
                    // Si no hay encabezado, asumir que la primera columna es la serie
                    lnbs = json.slice(1).map(row => ({
                        codigo: articuloCodigo,
                        nombreArticulo: articulo.nombre,
                        serie: row[0]?.toString().trim() || ''
                    })).filter(t => t.serie);
                }

                if (lnbs.length === 0) return reject("No se encontraron series válidas.");
                resolve(lnbs);
            } catch (err) {
                reject(err.message || "Error al leer el archivo Excel.");
            }
        };
        reader.onerror = () => reject("Error al cargar el archivo.");
        reader.readAsArrayBuffer(file);
    });
}

async function guardarIngresoSeriados(event) {
    event.preventDefault();
    const fileInput = document.getElementById('archivo-excel-seriados');
    const guia = document.getElementById('guia-seriados').value.trim();
    const fecha = document.getElementById('fecha-ingreso-seriados').value;
    const articuloCodigo = document.getElementById('articulo-seriado').value;

    if (!guia || !fecha || !articuloCodigo || !fileInput.files[0]) {
        return mostrarToast("Complete todos los campos.", "error");
    }
    if (!esFechaFutura(fecha)) {
        return mostrarToast("La fecha de ingreso debe ser hoy o futura.", "error");
    }

    try {
        const equipos = await procesarExcelEquipos(fileInput.files[0], articuloCodigo);
        const todosValidos = equipos.every(eq => eq.codigo === articuloCodigo);
        if (!todosValidos) {
            return mostrarToast(`Algunos códigos no coinciden con el artículo seleccionado (${articuloCodigo}).`, "error");
        }

        // 🔍 Buscar series ya existentes en todo el sistema
        const seriesExistentes = new Set();
        appData.ingresosSeriados.forEach(ing => {
            (ing.equipos || []).forEach(eq => {
                seriesExistentes.add(normalizarSerie(eq.serie1));
                if (eq.serie2) seriesExistentes.add(normalizarSerie(eq.serie2));
            });
        });
        appData.empleados.forEach(emp => {
            (emp.stock?.equipos || []).forEach(eq => {
                seriesExistentes.add(normalizarSerie(eq.serie1));
                if (eq.serie2) seriesExistentes.add(normalizarSerie(eq.serie2));
            });
        });

        const duplicados = equipos.filter(eq =>
            seriesExistentes.has(normalizarSerie(eq.serie1)) ||
            (eq.serie2 && seriesExistentes.has(normalizarSerie(eq.serie2)))
        );

        let equiposParaGuardar = [...equipos];

        if (duplicados.length > 0) {
            const seriesDup = duplicados.map(eq => `${eq.serie1}${eq.serie2 ? ` / ${eq.serie2}` : ''}`).join(', ');
            const mensaje = `⚠️ Se detectaron ${duplicados.length} equipos ya registrados:\n${seriesDup}\n\n¿Desea ingresarlos como remozados? (Se marcarán con "-R")`;
            
            const resultado = await new Promise(resolve => {
                mostrarConfirmacionConCallback(mensaje, () => resolve(true), () => resolve(false));
            });

            if (!resultado) {
                return mostrarToast("Ingreso cancelado por duplicados.", "info");
            }

            equiposParaGuardar = equipos.map(eq => {
                const esDuplicado = 
                    seriesExistentes.has(normalizarSerie(eq.serie1)) ||
                    (eq.serie2 && seriesExistentes.has(normalizarSerie(eq.serie2)));
                if (esDuplicado) {
                    return {
                        ...eq,
                        serie1: eq.serie1 + '-R',
                        serie2: eq.serie2 ? eq.serie2 + '-R' : ''
                    };
                }
                return eq;
            });
        }

        // 👇 CORRECCIÓN CLAVE: Guardar en Supabase como array de OBJETOS
        await supabase.from('ingresos').insert({
            tipo: 'equipo',
            articulo_codigo: articuloCodigo,
            series: equiposParaGuardar.map(eq => ({ serie1: eq.serie1, serie2: eq.serie2 })), // ✅ CORRECTO
            guia: guia,
            fecha: fecha
        });

        // 👇 Guardar en memoria con la estructura correcta
        const nuevoIngreso = {
            tipo: 'equipo',
            guia,
            fecha,
            articulo_codigo: articuloCodigo,
            equipos: equiposParaGuardar // ✅ ya es [{ serie1, serie2 }, ...]
        };

        if (!Array.isArray(appData.ingresosSeriados)) appData.ingresosSeriados = [];
        const guiaExistenteIndex = appData.ingresosSeriados.findIndex(ing => ing.guia === guia);
        if (guiaExistenteIndex > -1) {
            appData.ingresosSeriados[guiaExistenteIndex] = nuevoIngreso;
        } else {
            appData.ingresosSeriados.push(nuevoIngreso);
        }

        await registrarBitacora(
            'ingreso_bodega',
            `Ingreso guía ${guia} — ${equiposParaGuardar.length} equipos`,
            `Artículo: ${articuloCodigo} | Fecha: ${fecha}`
        );
        mostrarModalConfirmacion(equiposParaGuardar.length, 'equipo', articuloCodigo, () => {
            document.getElementById('form-ingreso-seriados').reset();
        });

    } catch (err) {
        console.error("Error en guardarIngresoSeriados:", err);
        mostrarToast("Error al guardar: " + (err.message || err), "error");
    }
}

function mostrarConfirmacionConCallback(mensaje, onSi, onNo) {
    const modal = document.createElement('div');
    modal.id = 'modal-confirmacion';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); z-index: 2000; display: flex; justify-content: center; align-items: center;`;
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            <p style="font-size: 1em; margin: 0 0 20px; white-space: pre-wrap;">${mensaje}</p>
            <div>
                <button id="btn-confirmar-si" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin-right: 10px;">Sí, ingresar como remozados</button>
                <button id="btn-confirmar-no" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px;">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('btn-confirmar-si').onclick = () => { modal.remove(); if (onSi) onSi(); };
    document.getElementById('btn-confirmar-no').onclick = () => { modal.remove(); if (onNo) onNo(); };
}

async function guardarIngresoNoSeriado(tipo, event) {
    event.preventDefault();
    
    // ✅ Determinar IDs y elementos según el tipo
    const config = {
        tarjeta: {
            formId: 'form-ingreso-no-seriados',
            fileInputId: 'archivo-excel-tarjetas',
            guiaId: 'guia-no-seriados',
            fechaId: 'fecha-ingreso-no-seriados',
            articuloSelectId: 'articulo-no-seriado',
            articulosArray: 'ferreteria',
            procesarExcel: procesarExcelTarjetas
        },
        lnb: {
            formId: 'form-ingreso-lnb',
            fileInputId: 'archivo-excel-lnb',
            guiaId: 'guia-lnb',
            fechaId: 'fecha-ingreso-lnb', // ASEGÚRATE de que este input exista en tu HTML
            articuloSelectId: 'articulo-lnb',
            articulosArray: 'lnbs',
            procesarExcel: procesarExcelLNB
        }
    };

    const cfg = config[tipo];
    if (!cfg) return mostrarToast("Tipo de ingreso no válido.", "error");

    const fileInput = document.getElementById(cfg.fileInputId);
    const guia = document.getElementById(cfg.guiaId)?.value.trim();
    const fecha = document.getElementById(cfg.fechaId)?.value;
    const articuloCodigo = document.getElementById(cfg.articuloSelectId)?.value;

    if (!guia || !fecha || !articuloCodigo || !fileInput?.files[0]) {
        return mostrarToast("Complete todos los campos.", "error");
    }

    if (!esFechaFutura(fecha)) {
        return mostrarToast("La fecha de ingreso debe ser hoy o futura.", "error");
    }

    try {
        const items = await cfg.procesarExcel(fileInput.files[0], articuloCodigo);
        const todosValidos = items.every(t => t.codigo === articuloCodigo);
        if (!todosValidos) {
            return mostrarToast(`Algunos códigos no coinciden con el artículo seleccionado (${articuloCodigo}).`, "error");
        }

        // 🔁 Nombre del array en appData según tipo
        const arrayIngresos = tipo === 'tarjeta' ? 'ingresosTarjetas' : 'ingresosLNB';
        const arrayArticulos = cfg.articulosArray;

        // Buscar guía existente
        const guiaExistenteIndex = appData[arrayIngresos]?.findIndex(ing => ing.guia === guia) ?? -1;

        const guardarEnSupabaseYMemoria = async () => {
            // ✅ Guardar en Supabase
            await supabase.from('ingresos').insert({
                tipo: tipo, // 'tarjeta' o 'lnb'
                articulo_codigo: articuloCodigo,
                series: items.map(t => ({ serie: t.serie })),
                guia: guia,
                fecha: fecha
            });

            // ✅ Guardar en memoria
            const nuevoIngreso = {
                tipo: tipo,
                guia,
                fecha,
                articuloCodigo,
                [tipo === 'tarjeta' ? 'tarjetas' : 'lnbs']: items,
                timestamp: Date.now()
            };

            if (!appData[arrayIngresos]) appData[arrayIngresos] = [];
            appData[arrayIngresos].push(nuevoIngreso);

            // ✅ Mostrar mensaje y resetear formulario
            await registrarBitacora(
                'ingreso_bodega',
                `Ingreso guía ${guia} — ${items.length} ${tipo}(s)`,
                `Artículo: ${articuloCodigo} | Fecha: ${fecha} | Tipo: ${tipo}`
            );
            mostrarModalConfirmacion(items.length, tipo, articuloCodigo, () => {
                document.getElementById(cfg.formId).reset();
            });
        };

        if (guiaExistenteIndex > -1) {
            mostrarConfirmacion(
                `La guía N° ${guia} ya fue ingresada. ¿Desea sobrescribirla?`,
                guardarEnSupabaseYMemoria,
                () => mostrarToast("Ingreso cancelado.", "info")
            );
        } else {
            await guardarEnSupabaseYMemoria();
        }

    } catch (err) {
        console.error("Error en guardarIngresoNoSeriado:", err);
        mostrarToast(err.message || "Error al procesar el ingreso.", "error");
    }
}

function mostrarModalConfirmacion(cantidad, tipo, codigoArticulo, onOtraGuia) {
    const modal = document.createElement('div');
    modal.id = 'modal-confirmacion';
    modal.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex;
align-items: center; justify-content: center; z-index: 3000;`;
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; max-width: 450px; width: 90%; text-align: center;">
            <h3 style="margin-top: 0; color: #007bff;">✅ Ingreso registrado</h3>
            <p>Se han ingresado <strong>${cantidad}</strong> ${tipo}(s) con código <strong>${codigoArticulo}</strong>.</p>
            <button id="btnAceptarIngreso" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin-top: 15px;">Aceptar</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('btnAceptarIngreso').addEventListener('click', () => {
        modal.remove();
        // ✅ Limpiar formulario sin preguntar nada
        onOtraGuia(); // Esta función ya limpia el formulario (se pasa desde guardarIngresoX)
    });
}

// ✅ NUEVA FUNCIÓN: busca serie directo en Supabase (siempre actualizado)
async function buscarSerieEnSupabase(terminoNorm) {
    const tablas = [
        { tabla: 'ingresos_seriados', campo: 'equipos',  tipo: 'equipo'  },
        { tabla: 'ingresos_tarjetas', campo: 'tarjetas', tipo: 'tarjeta' },
        { tabla: 'ingresos_lnb',      campo: 'lnbs',     tipo: 'lnb'     }
    ];

    let resultados = [];

    for (const { tabla, campo, tipo } of tablas) {
        const { data, error } = await supabase.from(tabla).select('*');
        if (error || !data) continue;

        for (const ing of data) {
            const items = ing[campo] || [];
            const encontrado = items.some(item => {
                if (tipo === 'equipo') {
                    return normalizarSerie(item.serie1) === terminoNorm ||
                        normalizarSerie(item.serie2) === terminoNorm;
                }
                return normalizarSerie(item.serie) === terminoNorm;
            });

            if (encontrado) {
                resultados.push({ ingreso: ing, tipo, campo });
            }
        }
    }
    return resultados;
}

// ============================================
// --- BÚSQUEDA DE SERIE (GLOBAL) ---
// ============================================
// =======================================================

async function buscarSerie() {
    const input = document.getElementById('input-buscar-serie');
    const resultadoDiv = document.getElementById('resultado-busqueda-serie');
    if (!input || !resultadoDiv) return;

    resultadoDiv.innerHTML = '<p style="color:#888;">🔍 Buscando en base de datos...</p>';

    const termino = input.value.trim();
    if (!termino) return mostrarToast("Ingrese un número de serie o código.", "error");
    const terminoNorm = normalizarSerie(termino);

    // Función auxiliar de comparación exacta
    const coincide = (a, b) => normalizarSerie(a || "") === normalizarSerie(b || "");

    // =========================================================
    // ✅ 1. BUSCAR EN ÓRDENES LIQUIDADAS (memoria local — OK)
    // =========================================================
    let resultados = [];
    let encontradoEnOrden = false;

    ordenes.forEach(o => {
        if (o.estado !== 'Liquidadas') return;

        const todasLasSeries = [
            ...(o.series_entrada || []),
            ...(o.series_tarjetas || []),
            ...(o.series_lnb || []),
            ...(o.series_salida || [])
        ]
        .filter(s => s !== null && s !== undefined)
        .map(s => typeof s === 'object' ? s.serie || s.serie1 : s)
        .filter(Boolean);

        if (!todasLasSeries.some(s => coincide(s, terminoNorm))) return;

        let codigoReal = '—', guiaReal = '—', usuarioCargaNombre = '—';
        let nombreArticuloReal = 'Asignado en orden';
        let tecnicoCierre = o.tecnico || 'No especificado';
        let rutCliente = o.rut_cliente || 'No especificado';

        const buscarEnIngresos = (lista, tipo) => {
            lista?.forEach(ing => {
                ing.equipos?.forEach(e => { if (coincide(e.serie1, terminoNorm) || coincide(e.serie2, terminoNorm)) asignar(ing, tipo); });
                ing.tarjetas?.forEach(t => { if (coincide(t.serie, terminoNorm)) asignar(ing, tipo); });
                ing.lnbs?.forEach(l => { if (coincide(l.serie, terminoNorm)) asignar(ing, tipo); });
            });
        };

        const asignar = (ingreso, tipo) => {
            codigoReal = ingreso.articulo_codigo;
            guiaReal = ingreso.guia || '—';
            const u = appData.usuarios?.find(user => user.rut === ingreso.usuario || user.nombre === ingreso.usuario);
            usuarioCargaNombre = u ? u.nombre : (ingreso.usuario || '—');
            const maestro = tipo === 'seriado' ? appData.articulos.seriados
                : tipo === 'ferreteria' ? appData.articulos.ferreteria
                : appData.articulos.lnbs;
            const art = maestro?.find(a => a.codigo === ingreso.articulo_codigo);
            if (art) nombreArticuloReal = art.nombre;
        };

        buscarEnIngresos(appData.ingresosSeriados, 'seriado');
        if (codigoReal === '—') buscarEnIngresos(appData.ingresosTarjetas, 'ferreteria');
        if (codigoReal === '—') buscarEnIngresos(appData.ingresosLNB, 'lnbs');

        resultados.push({
            tipo: 'Equipo/Tarjeta/LNB',
            guia: guiaReal,
            fecha: o.fecha,
            codigoArticulo: codigoReal !== '—' ? codigoReal : (o.articulo_codigo || '—'),
            nombreArticulo: nombreArticuloReal,
            serie1: termino,
            serie2: '',
            estado: 'Instalado en cliente',
            detalle: `Orden #${o.numero} - ${o.nombre_cliente}`,
            usuarioCarga: usuarioCargaNombre,
            tecnicoCierre,
            rutCliente
        });
        encontradoEnOrden = true;
    });

    // Si está en orden liquidada → mostrar y salir
    if (encontradoEnOrden) {
        let html = `<h3>Resultados encontrados (${resultados.length})</h3>`;
        resultados.forEach(r => {
            html += `
            <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:12px 0;border-left:4px solid #007bff">
                <p><strong>Tipo:</strong> ${r.tipo}</p>
                <p><strong>Nombre:</strong> ${r.nombreArticulo}</p>
                <p><strong>Código:</strong> ${r.codigoArticulo}</p>
                <p><strong>Guía:</strong> ${r.guia}</p>
                <p><strong>Fecha:</strong> ${r.fecha}</p>
                <p><strong>Serie:</strong> ${r.serie1}</p>
                <p><strong>Estado:</strong> <span style="color:#007bff;font-weight:bold">${r.estado}</span></p>
                <p><strong>Detalle:</strong> ${r.detalle}</p>
                <p><strong>Técnico que cerró:</strong> ${r.tecnicoCierre}</p>
                <p><strong>RUT Cliente:</strong> ${r.rutCliente}</p>
                <p><strong>Cargado por:</strong> ${r.usuarioCarga}</p>
            </div>`;
        });
        resultadoDiv.innerHTML = html;
        return;
    }

    // =========================================================
    // ✅ 2. BUSCAR DIRECTO EN SUPABASE (tabla: ingresos) 🔥
    //       Siempre fresco — si alguien eliminó, no aparece
    // =========================================================
    try {
        const { data, error } = await supabase
            .from('ingresos')
            .select('*');

        if (error) throw error;

        for (const ingreso of (data || [])) {
            const series = ingreso.series || [];

            for (const item of series) {
                if (!item) continue;

                const s1 = item.serie1 || '';
                const s2 = item.serie2 || '';
                const sSola = item.serie || '';

                const hayCoincidencia =
                    coincide(s1, terminoNorm) ||
                    coincide(s2, terminoNorm) ||
                    coincide(sSola, terminoNorm);

                if (!hayCoincidencia) continue;

                // Nombre del artículo
                const tipoIngreso = ingreso.tipo || 'equipo';
                const maestroKey = tipoIngreso === 'lnb' ? 'lnbs'
                    : tipoIngreso === 'tarjeta' ? 'ferreteria'
                    : 'seriados';
                const articulo = appData.articulos[maestroKey]
                    ?.find(a => a.codigo === ingreso.articulo_codigo);

                // ¿Está asignado a algún técnico?
                let estado = 'En bodega';
                let detalle = '';
                const empConSerie = appData.empleados?.find(emp => {
                    if (!emp.stock) return false;
                    if (tipoIngreso === 'equipo') {
                        return emp.stock.equipos?.some(e =>
                            coincide(e.serie1, s1) || coincide(e.serie2, s1) ||
                            coincide(e.serie1, s2) || coincide(e.serie2, s2)
                        );
                    } else if (tipoIngreso === 'tarjeta') {
                        return emp.stock.tarjetas?.some(t =>
                            coincide(t.serie, s1) || coincide(t.serie, sSola)
                        );
                    } else {
                        return emp.stock.lnbs?.some(l =>
                            coincide(l.serie, s1) || coincide(l.serie, sSola)
                        );
                    }
                });
            if (empConSerie) detalle = `${empConSerie.nombre1} ${empConSerie.apepaterno}`;
                if (detalle) estado = 'Asignado a técnico';

                // Usuario que cargó (campo creado_por según tu estructura)
                const u = appData.usuarios?.find(user =>
                    user.rut === ingreso.creado_por || user.nombre === ingreso.creado_por
                );

                const tipoLabel = tipoIngreso === 'lnb' ? 'LNB'
                    : tipoIngreso === 'tarjeta' ? 'Tarjeta'
                    : 'Equipo';

                resultados.push({
                    tipo: tipoLabel,
                    guia: ingreso.guia || '—',
                    fecha: ingreso.fecha || '—',
                    codigoArticulo: ingreso.articulo_codigo || '—',
                    nombreArticulo: articulo?.nombre || ingreso.articulo_codigo || '—',
                    serie1: s1 || sSola,
                    serie2: s2,
                    estado,
                    detalle,
                    usuarioCarga: u ? u.nombre : (ingreso.creado_por || '—')
                });
            }
        }
    } catch (err) {
        console.error('❌ Error al consultar Supabase en buscarSerie:', err);
        mostrarToast('❌ Error al conectar con la base de datos.', 'error');
        resultadoDiv.innerHTML = '';
        return;
    }

    // =========================================================
    // ✅ 3. RENDERIZADO FINAL
    // =========================================================
    if (!resultados.length) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ No se encontró ninguna serie o código.</p>';
        return;
    }

    let html = `<h3>Resultados encontrados (${resultados.length})</h3>`;
    resultados.forEach(r => {
        const colorEstado = r.estado === 'En bodega' ? '#28a745'
            : r.estado === 'Asignado a técnico' ? '#ffc107'
            : '#007bff';
        html += `
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:12px 0;border-left:4px solid ${colorEstado}">
            <p><strong>Tipo:</strong> ${r.tipo}</p>
            <p><strong>Nombre:</strong> ${r.nombreArticulo}</p>
            <p><strong>Código:</strong> ${r.codigoArticulo}</p>
            <p><strong>Guía:</strong> ${r.guia}</p>
            <p><strong>Fecha:</strong> ${r.fecha}</p>
            <p><strong>Serie:</strong> ${r.serie1}${r.serie2 ? ' / ' + r.serie2 : ''}</p>
            <p><strong>Estado:</strong> <span style="color:${colorEstado};font-weight:bold">${r.estado}</span></p>
            ${r.detalle ? `<p><strong>Técnico asignado:</strong> ${r.detalle}</p>` : ''}
            <p><strong>Cargado por:</strong> ${r.usuarioCarga}</p>
        </div>`;
    });
    resultadoDiv.innerHTML = html;
}

// ============================================
// --- FUNCIONES GLOBALES PARA ASIGNACIÓN DE MATERIALES ---
// ============================================

/**
 * Carga los materiales disponibles según el tipo seleccionado.
 * Solo muestra artículos con estado 'activo'.
 * @param {string} tipo - El tipo de material ('equipo', 'tarjeta', 'lnb').
 */
function cargarMaterialesAsignacion(tipo) {
    const select = document.getElementById('material-asignacion');
    if (!select) return;

    // Limpiar el select primero
    select.innerHTML = '<option value="">-- Seleccione Material --</option>';

    let materiales = [];
    if (tipo === 'equipo') {
        // Filtrar solo artículos activos
        materiales = appData.articulos.seriados.filter(a => a.activo);
    } else if (tipo === 'tarjeta') {
        // Filtrar solo artículos activos
        materiales = appData.articulos.ferreteria.filter(a => a.activo);
    } else if (tipo === 'lnb') {
        // Filtrar solo artículos activos
        materiales = appData.articulos.lnbs.filter(a => a.activo);
    }

    // Añadir las opciones al select
    materiales.forEach(art => {
        const option = document.createElement('option');
        option.value = art.codigo; // clave: debe coincidir con ingresos.articuloCodigo
        option.textContent = `${art.nombre} (${art.codigo})`;
        select.appendChild(option);
    });

    // Si no hay materiales activos, mostrar mensaje
    if (materiales.length === 0) {
        const option = document.createElement('option');
        option.textContent = "No hay materiales disponibles";
        option.disabled = true;
        select.appendChild(option);
    }
}

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btnAsignarMaterial") {
        const materialesSeleccionados = document.querySelectorAll(".chk-material:checked");
        if (materialesSeleccionados.length === 0) {
            mostrarToast("Seleccione al menos un material para asignar.", "error");
            return;
        }
        materialesSeleccionados.forEach(chk => {
            const id = chk.dataset.id;
            const material = appData.articulos.seriados.find(a => a.id == id);
            if (material) {
                material.asignado = true;
                material.fechaAsignacion = new Date().toISOString().split("T")[0];
            }
        });
        guardarDatosLogistica?.();
        mostrarToast("✅ Materiales asignados con éxito.");
        if (typeof renderTablaSeriados === "function") renderTablaSeriados();
    }
});

// =======================================================
// --- LÓGICA DEL NUEVO PANEL: SALDO TÉCNICO ---
// =======================================================

/**
 * Configura el panel de Saldo Técnico: carga técnicos en el filtro
 * y establece los listeners para renderizar el stock.
 */
function setupSaldoTecnico() {
    const select = document.getElementById('filtro-tecnico-saldo');
    const totalSpan = document.getElementById('total-asignado');
    const detalleDiv = document.getElementById('detalle-stock');
    const resumenDiv = document.getElementById('resumen-saldo-tecnico');

    // ✅ Validar elementos críticos del DOM
    if (!select || !totalSpan || !detalleDiv) {
        console.warn('⚠️ Elementos del DOM no encontrados para Saldo Técnico');
        return;
    }

    // ✅ Filtrar técnicos activos con cargo de técnico
    const tecnicosActivos = (appData.empleados || [])
        .filter(emp => 
            emp.activo && 
            appData.cargos?.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre))
        )
        .map(emp => ({
            value: emp.id,
            text: `${emp.nombre1} ${emp.apepaterno}`.trim()
        }))
        .sort((a, b) => a.text.localeCompare(b.text)); // ✅ Orden alfabético

    // ✅ Opciones del select
    const opciones = [
        { value: '', text: '-- Seleccione Técnico --' },
        { value: 'todos', text: '✅ Todos' },
        ...tecnicosActivos
    ];

    // ✅ Poblar select
    select.innerHTML = '';
    opciones.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        select.appendChild(opt);
    });

    // ✅ Función auxiliar para mostrar mensaje inicial
    const mostrarMensajeInicial = () => {
        if (totalSpan) totalSpan.textContent = '0';
        if (detalleDiv) {
            detalleDiv.innerHTML = 
                '<p style="text-align: center; color: #6c757d; margin-top: 40px;">Seleccione un técnico o "Todos" para ver el detalle del stock.</p>';
        }
        if (resumenDiv) resumenDiv.innerHTML = ''; // ✅ Limpiar resumen también
    };

    // ✅ Evento de cambio del select
    select.onchange = function () {
        try {
            if (this.value !== '') {
                // ✅ Validar que renderSaldoTecnico exista antes de llamarla
                if (typeof renderSaldoTecnico === 'function') {
                    renderSaldoTecnico();
                } else {
                    console.error('❌ renderSaldoTecnico no está definida');
                    mostrarToast('Error: Función de renderizado no disponible.', 'error');
                }
            } else {
                mostrarMensajeInicial();
            }
        } catch (error) {
            console.error('❌ Error en onchange de Saldo Técnico:', error);
            mostrarToast('Error al cargar el stock.', 'error');
            mostrarMensajeInicial();
        }
    };

    // ✅ Estado inicial al cargar el panel
    mostrarMensajeInicial();
    
    console.log('✅ setupSaldoTecnico inicializado correctamente');
}

function renderSaldoTecnico() {
    const select = document.getElementById('filtro-tecnico-saldo');
    const detalleDiv = document.getElementById('detalle-stock');
    const totalSpan = document.getElementById('total-asignado');
    const resumenDiv = document.getElementById('resumen-saldo-tecnico'); // ✅ Contenedor para resumen
    
    if (!select || !detalleDiv || !totalSpan) return;
    
    const tecnicoId = select.value;
    if (!tecnicoId) {
        detalleDiv.innerHTML = '<p>Seleccione un técnico o "Todos" para ver el detalle del stock.</p>';
        totalSpan.textContent = '0';
        if (resumenDiv) resumenDiv.innerHTML = ''; // ✅ Limpiar resumen
        return;
    }
    
    let empleadosAfectados = [];
    if (tecnicoId === 'todos') {
        empleadosAfectados = appData.empleados.filter(emp =>
            emp.activo &&
            appData.cargos.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre))
        );
    } else {
        const emp = appData.empleados.find(e => e.id === tecnicoId);
        if (emp) empleadosAfectados = [emp];
    }
    
    if (empleadosAfectados.length === 0) {
        detalleDiv.innerHTML = '<p>No hay técnicos con stock asignado.</p>';
        totalSpan.textContent = '0';
        if (resumenDiv) resumenDiv.innerHTML = ''; // ✅ Limpiar resumen
        return;
    }
    
    let totalItems = 0;
    
    // ✅ CONTAR TIPOS DE MATERIALES
    let conteoMateriales = {
        equipos: 0,
        tarjetas: 0,
        lnbs: 0
    };
    
    empleadosAfectados.forEach(emp => {
        conteoMateriales.equipos += (emp.stock?.equipos || []).length;
        conteoMateriales.tarjetas += (emp.stock?.tarjetas || []).length;
        conteoMateriales.lnbs += (emp.stock?.lnbs || []).length;
    });
    
    // ✅ RENDERIZAR RESUMEN
    if (resumenDiv) {
        resumenDiv.innerHTML = `
            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin-top: 0; color: #002d5a; display: flex; align-items: center;">
                    <i class="fas fa-boxes" style="margin-right: 10px;"></i>
                    📦 Resumen de Stock Asignado
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff;">
                        <strong style="font-size: 2.5em; color: #007bff; display: block;">${conteoMateriales.equipos}</strong>
                        <p style="margin: 10px 0 0 0; color: #495057; font-weight: 600;">Equipos</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ffc107;">
                        <strong style="font-size: 2.5em; color: #ffc107; display: block;">${conteoMateriales.tarjetas}</strong>
                        <p style="margin: 10px 0 0 0; color: #495057; font-weight: 600;">Tarjetas</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745;">
                        <strong style="font-size: 2.5em; color: #28a745; display: block;">${conteoMateriales.lnbs}</strong>
                        <p style="margin: 10px 0 0 0; color: #495057; font-weight: 600;">LNBs</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #002d5a, #0056b3); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <strong style="font-size: 2.8em; display: block;">${conteoMateriales.equipos + conteoMateriales.tarjetas + conteoMateriales.lnbs}</strong>
                        <p style="margin: 10px 0 0 0; font-weight: 600;">Total Materiales</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Función auxiliar para procesar cada fila
    const generarFila = (item, tipoLabel, nombreArt, nombreTec, rutTec) => {
        const fechaRaw = item.fechaAsignacion || null;
        const guia = item.guiaAsignacion || '—';
        let serie = '—';
        let fechaTexto = '—';
        let diasLabel = '—';

        // Diferenciar entre Equipo (serie1/serie2) y Tarjeta/LNB (serie)
        if (tipoLabel === 'Equipo') {
            serie = `${item.serie1 || ''}${item.serie2 ? ` / ${item.serie2}` : ''}`;
        } else {
            serie = item.serie || '—';
        }

        if (fechaRaw) {
            const f = new Date(fechaRaw);
            if (!isNaN(f.getTime())) {
                fechaTexto = f.toLocaleDateString('es-CL');
                const hoy = new Date();
                const diff = hoy - f;
                diasLabel = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
            }
        }
        return `
<tr>
<td>${nombreTec}</td>
<td>${rutTec}</td>
<td>${tipoLabel}</td>
<td>${nombreArt}</td>
<td>${serie}</td>
<td>${fechaTexto}</td>
<td>${diasLabel}</td>
<td>${guia}</td>
</tr>
`;
    };

    let html = `
<table class="saldo-tecnico-table">
<thead>
<tr>
<th>TÉCNICO</th>
<th>RUT</th>
<th>TIPO</th>
<th>ARTÍCULO</th>
<th>SERIE</th>
<th>FECHA ASIGNACIÓN</th>
<th>DÍAS</th>
<th>GUÍA</th>
</tr>
</thead>
<tbody>
`;

    empleadosAfectados.forEach(emp => {
        const nombreTecnico = `${emp.nombre1} ${emp.apepaterno}`;
        const rutTecnico = emp.rut;
        
        // ✅ ORDENAR LOS EQUIPOS ALFABÉTICAMENTE
        const equipos = [...(emp.stock?.equipos || [])];
        const equiposOrdenados = equipos.sort((a, b) => {
            const articuloA = appData.articulos.seriados.find(x => x.codigo === a.articuloCodigo);
            const articuloB = appData.articulos.seriados.find(x => x.codigo === b.articuloCodigo);
            return (articuloA?.nombre || '').localeCompare(articuloB?.nombre || '');
        });
        
        // Usar los equipos ordenados
        equiposOrdenados.forEach(eq => {
            const art = appData.articulos.seriados.find(a => a.codigo === eq.articuloCodigo);
            html += generarFila(eq, 'Equipo', art ? art.nombre : eq.articuloCodigo, nombreTecnico, rutTecnico);
            totalItems++;
        });
        
        // Tarjetas (sin ordenar)
        (emp.stock?.tarjetas || []).forEach(t => {
            const art = appData.articulos.ferreteria.find(a => a.codigo === t.articuloCodigo);
            html += generarFila(t, 'Tarjeta', art ? art.nombre : t.articuloCodigo, nombreTecnico, rutTecnico);
            totalItems++;
        });
        
        // LNBs (sin ordenar)
        (emp.stock?.lnbs || []).forEach(l => {
            const art = appData.articulos.lnbs.find(a => a.codigo === l.articuloCodigo);
            html += generarFila(l, 'LNB', art ? art.nombre : l.articuloCodigo, nombreTecnico, rutTecnico);
            totalItems++;
        });
    });

    html += `</tbody></table>`;
    detalleDiv.innerHTML = totalItems > 0 ? html : '<p>No se encontraron registros de stock.</p>';
    totalSpan.textContent = totalItems;
}

// === EXPORTAR EXCEL SALDO TÉCNICO (DESDE STOCK DE EMPLEADOS) ===
function exportarExcelSaldoTecnico() {
    try {
        // 1. Obtener técnico filtrado
        const tecnicoId = document.getElementById('filtro-tecnico-saldo')?.value || '';
        
        // 2. Filtrar empleados técnicos
        let empleadosFiltrados = [];
        
        if (tecnicoId && tecnicoId !== 'todos') {
            // Técnico específico
            const emp = appData.empleados.find(e => e.id === tecnicoId && e.activo);
            if (emp) empleadosFiltrados = [emp];
        } else {
            // Todos los técnicos activos (o cuando se selecciona "Todos")
            empleadosFiltrados = appData.empleados.filter(emp => 
                emp.activo && 
                appData.cargos.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre))
            );
        }
        
        if (!empleadosFiltrados.length) {
            alert('⚠️ No hay técnicos con stock para exportar.');
            return;
        }
        
        // 3. Extraer todas las filas de stock
        const filas = [];
        
        empleadosFiltrados.forEach(emp => {
            const nombreTecnico = `${emp.nombre1} ${emp.apepaterno}`;
            const rutTecnico = emp.rut;
            
            // === Equipos ===
            (emp.stock?.equipos || []).forEach(eq => {
                const articulo = appData.articulos.seriados.find(a => a.codigo === eq.articuloCodigo);
                const nombreEquipo = articulo ? articulo.nombre : eq.articuloCodigo;
                const fechaAsign = eq.fechaAsignacion || '—';
                let dias = '—';
                
                if (fechaAsign !== '—') {
                    const fechaAsignDate = new Date(fechaAsign);
                    if (!isNaN(fechaAsignDate.getTime())) {
                        const hoy = new Date();
                        const diffTime = hoy - fechaAsignDate;
                        dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                }
                
                filas.push({
                    'TÉCNICO': nombreTecnico,
                    'RUT': rutTecnico,
                    'TIPO': 'Equipo',
                    'ARTÍCULO': nombreEquipo,
                    'SERIE': `${eq.serie1}${eq.serie2 ? `/${eq.serie2}` : ''}`,
                    'FECHA ASIGNACIÓN': fechaAsign,
                    'DÍAS': dias,
                    'GUÍA': eq.guiaAsignacion || '—'
                });
            });
            
            // === Tarjetas ===
            (emp.stock?.tarjetas || []).forEach(t => {
                const articulo = appData.articulos.ferreteria.find(a => a.codigo === t.articuloCodigo);
                const nombreEquipo = articulo ? articulo.nombre : t.articuloCodigo;
                const fechaAsign = t.fechaAsignacion || '—';
                let dias = '—';
                
                if (fechaAsign !== '—') {
                    const fechaAsignDate = new Date(fechaAsign);
                    if (!isNaN(fechaAsignDate.getTime())) {
                        const hoy = new Date();
                        const diffTime = hoy - fechaAsignDate;
                        dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                }
                
                filas.push({
                    'TÉCNICO': nombreTecnico,
                    'RUT': rutTecnico,
                    'TIPO': 'Tarjeta',
                    'ARTÍCULO': nombreEquipo,
                    'SERIE': t.serie || '—',
                    'FECHA ASIGNACIÓN': fechaAsign,
                    'DÍAS': dias,
                    'GUÍA': t.guiaAsignacion || '—'
                });
            });
            
            // === LNBs ===
            (emp.stock?.lnbs || []).forEach(lnb => {
                const articulo = appData.articulos.lnbs.find(a => a.codigo === lnb.articuloCodigo);
                const nombreEquipo = articulo ? articulo.nombre : lnb.articuloCodigo;
                const fechaAsign = lnb.fechaAsignacion || '—';
                let dias = '—';
                
                if (fechaAsign !== '—') {
                    const fechaAsignDate = new Date(fechaAsign);
                    if (!isNaN(fechaAsignDate.getTime())) {
                        const hoy = new Date();
                        const diffTime = hoy - fechaAsignDate;
                        dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                }
                
                filas.push({
                    'TÉCNICO': nombreTecnico,
                    'RUT': rutTecnico,
                    'TIPO': 'LNB',
                    'ARTÍCULO': nombreEquipo,
                    'SERIE': lnb.serie || '—',
                    'FECHA ASIGNACIÓN': fechaAsign,
                    'DÍAS': dias,
                    'GUÍA': lnb.guiaAsignacion || '—'
                });
            });
        });
        
        if (!filas.length) {
            alert('⚠️ No hay stock asignado para exportar.');
            return;
        }
        
        // 4. Añadir número de fila
        const datosConIndice = filas.map((fila, index) => ({
            'N°': index + 1,
            ...fila
        }));
        
        // 5. Crear hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datosConIndice);
        
        // 6. Ajustar ancho de columnas
        const wscols = [
            { wch: 6 },    // N°
            { wch: 25 },   // TÉCNICO
            { wch: 12 },   // RUT
            { wch: 10 },   // TIPO
            { wch: 20 },   // ARTÍCULO
            { wch: 25 },   // SERIE
            { wch: 15 },   // FECHA ASIGNACIÓN
            { wch: 8 },    // DÍAS
            { wch: 15 }    // GUÍA
        ];
        ws['!cols'] = wscols;
        
        // 7. Aplicar estilos (encabezados en negrita)
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center" }
        };
        
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[address]) continue;
            ws[address].s = headerStyle;
        }
        
        // 8. Crear libro de Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Saldo Técnico");
        
        // 9. Generar nombre de archivo
        const fechaActual = new Date().toISOString().split('T')[0];
        const nombreTecnicoArchivo = tecnicoId 
            ? appData.empleados.find(e => e.id === tecnicoId)?.nombre1 || 'Tecnico'
            : 'Todos';
        
        const nombreArchivo = `Saldo_Tecnico_${nombreTecnicoArchivo}_${fechaActual}.xlsx`;
        
        // 10. Descargar archivo
        XLSX.writeFile(wb, nombreArchivo);
        
        console.log(`✅ Excel exportado: ${datosConIndice.length} registros`);
        mostrarToast(`✅ Excel exportado: ${datosConIndice.length} registros`, "success");
        
    } catch (error) {
        console.error("❌ Error al exportar Excel:", error);
        console.error("Stack trace:", error.stack);
        mostrarToast("❌ Error al exportar Excel. Ver consola.", "error");
    }
}

// ============================================
// --- GUIA DE ASIGNACION ---
// ============================================
function generarGuiaAsignacion() {
    const hoy = new Date();
    const fechaStr = hoy.toISOString().slice(0, 10).replace(/-/g, '');
    return `ASIG-${fechaStr}-0001`; // o usa un UUID
    return `ASIG-${crypto.randomUUID().slice(0, 8)}`;
}

// ============================================
// --- GUIA DE transferencias ---
// ============================================
function generarGuiaTransferencia(datos) {
    console.log("Entró a generarGuiaTransferencia");
    const contenedor = document.getElementById('guia-transferencia');
    const numeroGuia = `TR-${Date.now()}`;

    let filas = '';
    datos.items.forEach(item => {
        filas += `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.cantidad}</td>
            </tr>
        `;
    });

    contenedor.innerHTML = `
        <div class="guia-print">
            <h2>GUÍA DE TRANSFERENCIA DE MATERIALES</h2>
            <p><strong>N° Guía:</strong> ${numeroGuia}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</p>
            <p><strong>Origen:</strong> ${datos.origenNombre}</p>
            <p><strong>Destino:</strong> ${datos.destinoNombre || 'Bodega'}</p>
            <p><strong>Tipo:</strong> ${datos.tipo}</p>
            <p><strong>Usuario:</strong> ${datos.usuario}</p>

            <table border="1" width="100%" cellspacing="0" cellpadding="6">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>

            <br><br>

            <div style="display:flex; justify-content:space-between; margin-top:60px;">
                <div>
                    ___________________________<br>
                    Firma Origen
                </div>
                <div>
                    ___________________________<br>
                    Firma Destino
                </div>
            </div>
        </div>
    `;

    contenedor.style.display = 'block';
    window.print();
    contenedor.style.display = 'none';
}

// ============================================
// --- CORREOS ---
// ============================================
async function enviarCorreoAsignacion(tecnico, tipo, codigo, detalle, guia) {
    const articulo = tipo === 'equipo' ?
        appData.articulos.seriados.find(a => a.codigo === codigo) :
        appData.articulos.ferreteria.find(a => a.codigo === codigo);
    const nombreArticulo = articulo?.nombre || codigo;
    let cuerpo = `Hola ${tecnico.nombre1},\n\n`;
    cuerpo += `Se han asignado los siguientes equipos: **${guia}**\n\n`;
    cuerpo += `Muy buen día: ${nombreArticulo} (${codigo})\n\n`;
    if (tipo === 'equipo') {
        cuerpo += `Series asignadas (${detalle.length}):\n`;
        detalle.forEach(eq => {
            cuerpo += `- ${eq.serie1} / ${eq.serie2}\n`;
        });
    } else {
        cuerpo += `Cantidad asignada: ${detalle.length}\n`;
    }
    cuerpo += `\nSaludos,\nSistema de Gestión Logística`;
    const asunto = `Asignación de Material - Guía ${guia}`;
    const templateParams = {
        to_name: tecnico.nombre1,
        subject: asunto,
        message: cuerpo
    };
    if (tecnico.email) {
        templateParams.to_email = tecnico.email;
        try {
            await emailjs.send('service_8p2y4a6', 'template_m8313jl', templateParams);
            console.log("✅ Correo enviado al técnico:", tecnico.email);
        } catch (error) {
            console.error("❌ Error al enviar al técnico:", error);
            mostrarToast(`Error al enviar correo a ${tecnico.nombre1}.`, "error");
        }
    }
    templateParams.to_email = "bodegapoolosorno@gmail.com";
    templateParams.subject = "[COPIA BODEGA] " + asunto;
    templateParams.message = cuerpo + "\n\n--- COPIA DE RESPALDO PARA BODEGA ---";
    try {
        await emailjs.send('service_8p2y4a6', 'template_m8313jl', templateParams);
        console.log("✅ Copia enviada a bodega: bodegapoolosorno@gmail.com");
        mostrarToast(`✅ Asignación enviada a ${tecnico.nombre1} y copia a bodega.`, "success");
    } catch (error) {
        console.error("❌ Error al enviar copia a bodega:", error);
        mostrarToast("Asignación guardada, pero error al enviar correos.", "warning");
    }
}

function calcularSaldoBodega() {
    const tbody = document.getElementById('tabla-saldo-bodega');
    if (!tbody) return;
    const saldo = [];

    // --- 1. EQUIPOS ---
    const articulosSeriados = appData.articulos?.seriados || [];
    articulosSeriados.forEach(art => {
        // Total ingresado
        let enBodega = 0;
        (appData.ingresosSeriados || []).forEach(ing => {
            if (ing.articulo_codigo === art.codigo) {
                enBodega += (ing.series || []).length;
            }
        });

        // Total asignado a técnicos
        let asignados = 0;
        appData.empleados.forEach(emp => {
            (emp.stock?.equipos || []).forEach(eq => {
                if (eq.articuloCodigo === art.codigo) {
                    asignados++;
                }
            });
        });

        // ✅ Total instalado en clientes (Liquidadas)
        let instalados = 0;
        ordenes.forEach(o => {
            if (o.estado === 'Liquidadas' && Array.isArray(o.series_entrada)) {
                o.series_entrada.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) {
                        const serieNorm = normalizarSerie(serie);
                        const encontrada = appData.ingresosSeriados.some(ing =>
                            ing.articulo_codigo === art.codigo &&
                            (ing.equipos || []).some(s => {
                                const sVal = typeof s === 'object' ? s.serie1 : s;
                                return normalizarSerie(sVal) === serieNorm;
                            })
                        );
                        if (encontrada) instalados++;
                    }
                });
            }
        });

        const disponible = Math.max(0, enBodega - asignados - instalados);
        if (disponible > 0 || enBodega > 0) {
            saldo.push({
                nombre: art.nombre,
                tipo: 'Equipo',
                enBodega,
                asignadoATecnicos: asignados,
                instalados,
                disponible
            });
        }
    });

    // --- 2. TARJETAS ---
    const articulosFerreteria = appData.articulos?.ferreteria || [];
    articulosFerreteria.forEach(art => {
        let enBodega = 0;
        (appData.ingresosTarjetas || []).forEach(ing => {
            if (ing.articulo_codigo === art.codigo) {
                enBodega += (ing.series || []).length;
            }
        });

        let asignadas = 0;
        appData.empleados.forEach(emp => {
            (emp.stock?.tarjetas || []).forEach(t => {
                if (t.articuloCodigo === art.codigo) {
                    asignadas++;
                }
            });
        });

        let instaladas = 0;
        ordenes.forEach(o => {
            if (o.estado === 'Liquidadas' && Array.isArray(o.series_tarjetas)) {
                o.series_tarjetas.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) {
                        const serieNorm = normalizarSerie(serie);
                        const encontrada = appData.ingresosTarjetas.some(ing =>
                            ing.articulo_codigo === art.codigo &&
                            (ing.tarjetas || []).some(s => {
                                const sVal = typeof s === 'object' ? s.serie : s;
                                return normalizarSerie(sVal) === serieNorm;
                            })
                        );
                        if (encontrada) instaladas++;
                    }
                });
            }
        });

        const disponible = Math.max(0, enBodega - asignadas - instaladas);
        if (disponible > 0 || enBodega > 0) {
            saldo.push({
                nombre: art.nombre,
                tipo: 'Tarjeta',
                enBodega,
                asignadoATecnicos: asignadas,
                instalados,
                disponible
            });
        }
    });

    // --- 3. LNBs ---
    const articulosLNB = appData.articulos?.lnbs || [];
    articulosLNB.forEach(art => {
        let enBodega = 0;
        (appData.ingresosLNB || []).forEach(ing => {
            if (ing.articulo_codigo === art.codigo) {
                enBodega += (ing.series || []).length;
            }
        });

        let asignados = 0;
        appData.empleados.forEach(emp => {
            (emp.stock?.lnbs || []).forEach(l => {
                if (l.articuloCodigo === art.codigo) {
                    asignados++;
                }
            });
        });

        let instalados = 0;
        ordenes.forEach(o => {
            if (o.estado === 'Liquidadas' && Array.isArray(o.series_lnb)) {
                o.series_lnb.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) {
                        const serieNorm = normalizarSerie(serie);
                        const encontrada = appData.ingresosLNB.some(ing =>
                            ing.articulo_codigo === art.codigo &&
                            (ing.lnbs || []).some(s => {
                                const sVal = typeof s === 'object' ? s.serie : s;
                                return normalizarSerie(sVal) === serieNorm;
                            })
                        );
                        if (encontrada) instalados++;
                    }
                });
            }
        });

        const disponible = Math.max(0, enBodega - asignados - instalados);
        if (disponible > 0 || enBodega > 0) {
            saldo.push({
                nombre: art.nombre,
                tipo: 'LNB',
                enBodega,
                asignadoATecnicos: asignados,
                instalados,
                disponible
            });
        }
    });

    // --- RENDER ---
    if (saldo.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; font-size: 16px;">No hay stock en bodega</td></tr>`;
    } else {
        // Calcular totales
        const totalBodega     = saldo.reduce((s, i) => s + i.disponible, 0);
        const totalAsignado   = saldo.reduce((s, i) => s + i.asignadoATecnicos, 0);
        const totalInstalados = saldo.reduce((s, i) => s + i.instalados, 0);
        const totalIngreso    = saldo.reduce((s, i) => s + i.enBodega, 0);

        tbody.innerHTML = saldo.map(item => `
            <tr>
                <td style="padding: 12px 16px; font-size: 16px;">${item.nombre}</td>
                <td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.tipo}</td>
                <td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.disponible}</td>
                <td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.asignadoATecnicos}</td>
                <td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.instalados}</td>
                <td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.enBodega}</td>
            </tr>
        `).join('') + `
            <tr style="
                background: linear-gradient(135deg, #002d5a, #0056b3);
                color: white;
                font-weight: bold;
                font-size: 16px;
                border-top: 3px solid #001a3a;
            ">
                <td style="padding: 14px 16px;" colspan="2">📦 TOTAL GENERAL</td>
                <td style="padding: 14px 16px; text-align: center;">${totalBodega}</td>
                <td style="padding: 14px 16px; text-align: center;">${totalAsignado}</td>
                <td style="padding: 14px 16px; text-align: center;">${totalInstalados}</td>
                <td style="padding: 14px 16px; text-align: center;">${totalIngreso}</td>
            </tr>
        `;
    }
}

function exportarStockBodegaAExcel() {
    mostrarLoader('Exportando stock completo...');
 
    setTimeout(() => {
        const filas = [];
        const hoy = new Date();
        const consumidas = construirSetSeriesConsumidas();
 
        // Una sola tabla "ingresos" con campo "tipo" y array "series"
        const todosLosIngresos = [
            ...(appData.ingresosSeriados || []),
            ...(appData.ingresosTarjetas || []),
            ...(appData.ingresosLNB || [])
        ];
 
        todosLosIngresos.forEach(ingreso => {
            const tipoIngreso = ingreso.tipo || 'equipo';
            const series = ingreso.series || [];
            if (!Array.isArray(series) || series.length === 0) return;
 
            // Nombre legible del tipo
            const tipoLabel = tipoIngreso === 'lnb' ? 'LNB'
                : tipoIngreso === 'tarjeta' ? 'Tarjeta'
                : 'Equipo';
 
            // Artículo desde maestro
            const maestroKey = tipoIngreso === 'lnb' ? 'lnbs'
                : tipoIngreso === 'tarjeta' ? 'ferreteria'
                : 'seriados';
            const articulo = appData.articulos[maestroKey]
                ?.find(a => a.codigo === ingreso.articulo_codigo);
            const nombreArticulo = articulo?.nombre || ingreso.articulo_codigo || '—';
 
            // Días en sistema
            const fechaIngreso = ingreso.fecha ? new Date(ingreso.fecha) : null;
            let diasEnSistema = '—';
            if (fechaIngreso && !isNaN(fechaIngreso.getTime())) {
                diasEnSistema = Math.ceil((hoy - fechaIngreso) / (1000 * 60 * 60 * 24));
            }
 
            series.forEach(item => {
                if (!item) return; // ← evita el null que reventaba todo
 
                // Extraer series según tipo
                const serie1 = item.serie1 || item.serie || '';
                const serie2 = item.serie2 || '';
                if (!serie1) return;
 
                const serie1Norm = normalizarSerie(serie1);
 
                // Determinar estado
                let estado = 'Disponible';
                let tecnicoAsignado = 'En bodega';
 
                // ¿Está consumido (instalado en orden liquidada)?
                const estaConsumido = tipoIngreso === 'equipo'
                    ? consumidas.equipos.has(serie1Norm)
                    : tipoIngreso === 'tarjeta'
                    ? consumidas.tarjetas.has(serie1Norm)
                    : consumidas.lnbs.has(serie1Norm);
 
                if (estaConsumido) {
                    estado = 'Consumido';
                    tecnicoAsignado = 'Consumido';
                } else {
                    // ¿Está asignado a un técnico?
                    appData.empleados?.forEach(emp => {
                        if (!emp.stock) return;
                        let asignado = false;
                        if (tipoIngreso === 'equipo') {
                            asignado = emp.stock?.equipos?.some(e =>
                                normalizarSerie(e.serie1) === serie1Norm ||
                                normalizarSerie(e.serie2) === serie1Norm
                            );
                        } else if (tipoIngreso === 'tarjeta') {
                            asignado = emp.stock?.tarjetas?.some(t =>
                                normalizarSerie(t.serie) === serie1Norm
                            );
                        } else {
                            asignado = emp.stock?.lnbs?.some(l =>
                                normalizarSerie(l.serie) === serie1Norm
                            );
                        }
                        if (asignado) {
                            estado = 'Asignado';
                            tecnicoAsignado = `${emp.nombre1} ${emp.apepaterno}`;
                        }
                    });
                }
 
                filas.push({
                    'N°': filas.length + 1,
                    'Serie': serie1,
                    'Serie2': serie2,
                    'Bodega': 'Osorno',
                    'Nombre equipo': nombreArticulo,
                    'Código artículo': ingreso.articulo_codigo || '—',
                    'Tipo': tipoLabel,
                    'Fecha ingreso': ingreso.fecha || '—',
                    'Guía': ingreso.guia || '—',
                    'Días en sistema': diasEnSistema,
                    'Estado': estado,
                    'Técnico asignado': tecnicoAsignado
                });
            });
        });
 
        if (filas.length === 0) {
            ocultarLoader();
            return mostrarToast('⚠️ No hay stock para exportar.', 'info');
        }
 
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filas);
 
        // Ajuste de anchos de columna
        const colWidths = {};
        filas.forEach(row => {
            Object.keys(row).forEach(key => {
                const len = String(row[key]).length;
                colWidths[key] = Math.max(colWidths[key] || 10, len);
            });
        });
        ws['!cols'] = Object.keys(filas[0]).map(key => ({
            wch: Math.min(Math.max(colWidths[key] || 10, 10), 50)
        }));
 
        XLSX.utils.book_append_sheet(wb, ws, 'Stock_Completo');
 
        const fechaActual = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `Stock_Completo_Bodega_Tecnicos_${fechaActual}.xlsx`);
 
        mostrarToast(`✅ Exportadas ${filas.length} series (Disponible / Asignado / Consumido)`, 'success');
        ocultarLoader();
    }, 100);
}

function renderBodegaReversa() {
    const tbody = document.querySelector("#tabla-bodega-reversa tbody");
    if (!tbody) return;
 
    const datos = appData.bodegaReversa || [];
 
    tbody.innerHTML = datos.map(eq => {
        const serie = eq.serie || eq.serie1 || '—';
        const tipo = eq.tipo === 'tarjeta' ? '🃏 Tarjeta'
            : eq.tipo === 'lnb' ? '📡 LNB'
            : eq.tipo === 'reversa' ? '📦 Equipo'
            : (eq.tipo || '—');
 
        return `
        <tr>
            <td>${eq.articulo || eq.articulo_codigo || '—'}</td>
            <td>${tipo}</td>
            <td>${serie}</td>
            <td>${eq.fecha || '—'}</td>
            <td>${eq.guia || eq.numero_orden || '—'}</td>
            <td>${eq.tecnico || '—'}</td>
        </tr>`;
    }).join('');
 
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;">Sin registros en bodega reversa</td></tr>';
    }
}

function renderBodegaMalos() {
    const tbody = document.querySelector("#tabla-bodega-malos tbody");
    if (!tbody) return;
    
    const datos = appData.bodegaMalos || [];
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">Sin equipos en Bodega Malos</td></tr>';
        return;
    }
    
    tbody.innerHTML = datos.map(item => {
        const serie1 = item.serie1 || '—';
        const serie2 = item.serie2 ? ` / ${item.serie2}` : '';
        const fecha = item.fecha_devolucion || item.fecha || '—';
        
        // ✅ NUEVO: Mostrar estado de gestión
        const estadoGestion = item.estado_gestion || 'pendiente';
        let badgeEstado = '';
        
        if (estadoGestion === 'reintegrado') {
            badgeEstado = '<span style="background:#28a745;color:white;padding:3px 10px;border-radius:12px;font-size:11px;">✅ Reintegrado</span>';
        } else if (estadoGestion === 'devuelto_mandante') {
            badgeEstado = '<span style="background:#dc3545;color:white;padding:3px 10px;border-radius:12px;font-size:11px;">📤 Devuelto</span>';
        } else {
            badgeEstado = '<span style="background:#ffc107;color:#333;padding:3px 10px;border-radius:12px;font-size:11px;">⏳ Pendiente</span>';
        }
        
        return `
        <tr>
            <td>${item.articulo_nombre || item.articulo_codigo || '—'}</td>
            <td style="font-family:monospace;font-size:12px;">${serie1}${serie2}</td>
            <td>${fecha}</td>
            <td>
                <span style="background:#fee2e2;color:#991b1b;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;">
                    🏭 Bodega Malo
                </span>
                ${badgeEstado}
                ${item.observacion ? `<br><small style="color:#666;">${item.observacion}</small>` : ''}
            </td>
        </tr>`;
    }).join('');
}

function cargarArticulosEnSelects() {
    const selectSeriado = document.getElementById('articulo-seriado');
    const selectFerreteria = document.getElementById('articulo-no-seriado');
    
    if (selectSeriado) {
        populateSelect(selectSeriado, 
            appData.articulos.seriados
                .filter(a => a.activo) // 👈 solo artículos activos
                .map(a => ({ value: a.codigo, text: `${a.nombre} (${a.codigo})` })), 
            "Seleccione Artículo"
        );
    }
    
    if (selectFerreteria) {
        populateSelect(selectFerreteria, 
            appData.articulos.ferreteria
                .filter(a => a.activo) // 👈 solo artículos activos
                .map(a => ({ value: a.codigo, text: `${a.nombre} (${a.codigo})` })), 
            "Seleccione Artículo"
        );
    }
}

/**
 * Renderiza el formulario de liquidación para una orden específica,
 * cargando las series disponibles del técnico asignado.
 * SOLO equipos seriados: Decos, Modem, Extensores (sin LNB ni tarjetas).
 * @param {string} ordenId - El ID de la orden a liquidar.
 */
function renderFormularioLiquidacion(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;
    
    // === 1. EXTRAER CANTIDADES DEL SUBSERVICIO ===
    function extraerCantidadDecos(subservicio) {
        const match = subservicio.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
    }
    
    function extraerCantidadExtensores(subservicio) {
        const match = subservicio.match(/(\d+)\s*ext/i) || subservicio.match(/extensor.*?(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
    }
    
    const servicio = (orden.servicio || '').trim().toLowerCase();
    const subservicio = (orden.subservicio || '').trim().toLowerCase();
    
    let numDecos = 0;
    let decosObligatorios = false;
    let numExtensores = 0;
    
    // Determinar cantidades según tipo de servicio
    if (servicio.includes('instalacion') || servicio.includes('instalación')) {
        numDecos = extraerCantidadDecos(subservicio) || 1;
        decosObligatorios = true;
        numExtensores = extraerCantidadExtensores(subservicio);
    } else if (servicio.includes('adicional')) {
        numDecos = extraerCantidadDecos(subservicio) || 1;
        decosObligatorios = true;
        numExtensores = extraerCantidadExtensores(subservicio);
    } else if (servicio.includes('vt') || servicio.includes('traslado') || servicio.includes('regularizacion')) {
        numDecos = 5;
        decosObligatorios = false;
        numExtensores = 0;
    } else {
        numDecos = 1;
        decosObligatorios = false;
        numExtensores = 0;
    }
    
    // === 2. BUSCAR TÉCNICO Y SU STOCK ===
    const tecnicoNombre = orden.tecnico?.trim();
    const tecnico = tecnicoNombre 
        ? appData.empleados.find(emp => `${emp.nombre1} ${emp.apepaterno}`.trim() === tecnicoNombre)
        : null;
    
    if (!tecnico) {
        document.getElementById('contenedor-series').innerHTML = 
            '<p style="color: red;">❌ No se encontró el técnico asignado.</p>';
        return;
    }
    
    // Recargar stock si está vacío
    if (!tecnico.stock?.equipos?.length) {
        console.warn('⚠️ Stock vacío, recargando...');
        cargarDatos().then(() => {
            const tecActualizado = appData.empleados.find(emp => 
                `${emp.nombre1} ${emp.apepaterno}`.trim() === tecnicoNombre
            );
            if (tecActualizado) {
                renderFormularioLiquidacionConStock(ordenId, tecActualizado, numDecos, decosObligatorios, numExtensores);
            }
        });
        return;
    }

    renderFormularioLiquidacionConStock(ordenId, tecnico, numDecos, decosObligatorios, numExtensores);
}

/**
 * Función auxiliar: renderiza el formulario con el stock garantizado
 */
function renderFormularioLiquidacionConStock(ordenId, tecnico, numDecos, decosObligatorios, numExtensores) {
    const stockEquipos = tecnico.stock?.equipos || [];
    
    // Obtener series disponibles para dropdowns
    const opcionesEquipos = stockEquipos.map(eq => eq.serie1).filter(Boolean);
    
    // === HELPER: crear input con dropdown ===
    function crearInputConDropdown({ id, clase, dataTipo, dataIndex, placeholder, opciones, requerido = false }) {
        const uid = id || `input-${dataTipo}-${dataIndex}-${ordenId}`;
        const opcionesHTML = opciones.map(op =>
            `<div class="dropdown-option" data-value="${op}" style="padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid #f0f0f0;" 
                onmousedown="event.preventDefault(); seleccionarOpcionDropdown('${uid}', '${op}')">${op}</div>`
        ).join('');

        return `
        <div style="position: relative;">
            <div style="display: flex; gap: 4px;">
                <input type="text" id="${uid}" class="${clase} form-control" 
                    data-tipo="${dataTipo}" ${dataIndex !== undefined ? `data-index="${dataIndex}"` : ''}
                    ${requerido ? 'required' : ''} placeholder="${placeholder}" autocomplete="off"
                    style="width:100%; padding:6px 32px 6px 8px; margin-top:4px; border:1px solid #ced4da; border-radius:4px;">
                <button type="button" onclick="toggleDropdown('${uid}')" 
                    style="margin-top:4px; padding:0 8px; border:1px solid #ced4da; border-radius:4px; background:#f8f9fa; cursor:pointer; font-size:12px;">▼</button>
            </div>
            <div id="dropdown-${uid}" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; 
                border:1px solid #ced4da; border-radius:4px; max-height:180px; overflow-y:auto; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                ${opcionesHTML.length ? opcionesHTML : '<div style="padding:8px 12px; color:#999; font-size:13px;">Sin stock disponible</div>'}
            </div>
        </div>`;
    }

    let html = '';

    // --- Decos/Modem (todos como "equipo") ---
    for (let i = 1; i <= numDecos; i++) {
        const asterisco = decosObligatorios ? ' <span style="color:red">*</span>' : '(Opcional)';
        html += `
        <div data-deco-index="${i - 1}" style="background:#f8f9fa; padding:10px; border-radius:6px; margin-bottom:12px; ${decosObligatorios ? 'border-left:4px solid #28a745;' : ''}">
            <label>Equipo ${i}${asterisco}: </label>
            ${crearInputConDropdown({
                clase: 'input-serie-manual',
                dataTipo: 'equipo',
                dataIndex: i - 1,
                placeholder: 'Ingrese o seleccione serie',
                opciones: opcionesEquipos,
                requerido: decosObligatorios
            })}
        </div>`;
    }

    // --- Extensores (si aplican) ---
    if (numExtensores > 0) {
        html += `<h4 style="margin:20px 0 10px; color:#6c757d; border-bottom:2px solid #eee;">Extensores</h4>`;
        for (let i = 1; i <= numExtensores; i++) {
            html += `
            <div style="background:#f8f9fa; padding:10px; border-radius:6px; margin-bottom:12px;">
                <label>Extensor ${i} (Opcional): </label>
                ${crearInputConDropdown({
                    clase: 'input-serie-manual',
                    dataTipo: 'extensor',
                    dataIndex: i - 1,
                    placeholder: 'Ingrese o seleccione serie',
                    opciones: opcionesEquipos,
                    requerido: false
                })}
            </div>`;
        }
    }

    // --- Equipos Retirados (si es servicio con retiro) ---
    const esServicioConRetiro = servicio.includes('vt') || servicio.includes('traslado') || servicio.includes('regularizar');
    
    if (esServicioConRetiro) {
        html += `
        <h4 style="margin:20px 0 15px; color:#dc3545; border-bottom:2px solid #eee; padding-bottom:10px;">Equipos Retirados (Opcional)</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">`;
        
        for (let i = 1; i <= 5; i++) {
            html += `
            <div style="display:flex; align-items:center; gap:8px; padding:8px; background:#fff; border:1px solid #ced4da; border-radius:6px;">
                <label style="font-weight:500; color:#333; min-width:100px; text-align:right;">Equipo ${i}: </label>
                <input type="text" class="input-serie-salida" data-salida-index="${i - 1}"
                    placeholder="Serie Equipo ${i}"
                    style="flex:1; padding:8px; border:none; outline:none; background:transparent;">
            </div>`;
        }
        html += `</div>`;
    }

    document.getElementById('contenedor-series').innerHTML = html;

    // === VALIDACIÓN EN TIEMPO REAL ===
    const valoresActuales = new Set();

    document.querySelectorAll('#contenedor-series .input-serie-manual').forEach(input => {
        input.addEventListener('blur', function() {
            const serie = this.value.trim();
            const prev = this.dataset.prevValue || '';
            
            if (!serie) {
                if (prev) valoresActuales.delete(prev);
                delete this.dataset.prevValue;
                verificarBotonLiquidacion();
                return;
            }
            
            // Validar que exista en sistema
            if (!serieExisteEnIngresos(serie)) {
                mostrarToastFront(`La serie "${serie}" no existe en el sistema.`, 'error');
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                this.focus();
                verificarBotonLiquidacion();
                return;
            }
            
            // Validar duplicados
            const otros = Array.from(valoresActuales).filter(v => v !== prev);
            if (otros.includes(serie)) {
                mostrarToastFront(`La serie "${serie}" ya está seleccionada.`, 'error');
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                this.focus();
                verificarBotonLiquidacion();
                return;
            }
            
            if (prev) valoresActuales.delete(prev);
            valoresActuales.add(serie);
            this.dataset.prevValue = serie;
            verificarBotonLiquidacion();
        });
        
        input.addEventListener('focus', function() {
            this.dataset.prevValue = this.value.trim();
        });
        
        input.addEventListener('input', function() {
            const inputId = this.id || `input-equipo-${this.dataset.index}-${ordenId}`;
            filtrarDropdown(inputId, this.value);
            verificarBotonLiquidacion();
        });
    });

    // === PRE-LLENAR SERIES EXISTENTES ===
    setTimeout(() => {
        if (orden.series_entrada?.length) {
            orden.series_entrada.forEach((serie, idx) => {
                const input = document.querySelector(
                    `#contenedor-series .input-serie-manual[data-tipo="equipo"][data-index="${idx}"]`
                );
                if (input && serie) {
                    input.value = serie;
                    input.dataset.prevValue = serie;
                    valoresActuales.add(serie);
                }
            });
        }
        if (orden.series_extensores?.length) {
            orden.series_extensores.forEach((serie, idx) => {
                const input = document.querySelector(
                    `#contenedor-series .input-serie-manual[data-tipo="extensor"][data-index="${idx}"]`
                );
                if (input && serie) {
                    input.value = serie;
                    input.dataset.prevValue = serie;
                    valoresActuales.add(serie);
                }
            });
        }
        if (orden.series_salida?.length) {
            const inputsSalida = document.querySelectorAll('#contenedor-series .input-serie-salida');
            orden.series_salida.forEach((serie, idx) => {
                if (inputsSalida[idx] && serie) inputsSalida[idx].value = serie;
            });
        }
        verificarBotonLiquidacion();
    }, 100);
}

// Función separada para renderizar con stock garantizado
function renderFormularioLiquidacionConStock(ordenId, tecnico, numDecos, decosObligatorios, mostrarLNB) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    const servicio = (orden.servicio || '').trim().toLowerCase();
    const stock = tecnico.stock || { equipos: [], tarjetas: [], lnbs: [] };

    // === DEBUG: Verificar stock antes de renderizar ===
    console.log('🔍 Stock del técnico:', tecnico.stock);
    console.log('📦 Equipos disponibles:', stock.equipos?.length || 0);
    console.log('🃏 Tarjetas disponibles:', stock.tarjetas?.length || 0);
    console.log('📡 LNBs disponibles:', stock.lnbs?.length || 0);
    // === HELPER: crear input con dropdown custom ===
    function crearInputConDropdown({ id, clase, dataTipo, dataIndex, placeholder, opciones, requerido = false }) {
        const uid = id || `input-${dataTipo}-${dataIndex}-${ordenId}`;
        const opcionesHTML = opciones.map(op =>
            `<div class="dropdown-option" data-value="${op}" style="
                padding: 8px 12px;
                cursor: pointer;
                font-size: 13px;
                border-bottom: 1px solid #f0f0f0;
            " onmousedown="event.preventDefault(); seleccionarOpcionDropdown('${uid}', '${op}')">${op}</div>`
        ).join('');

        return `
        <div style="position: relative;">
            <div style="display: flex; gap: 4px;">
                <input type="text"
                    id="${uid}"
                    class="${clase} form-control"
                    data-tipo="${dataTipo}"
                    ${dataIndex !== undefined ? `data-index="${dataIndex}"` : ''}
                    ${requerido ? 'required' : ''}
                    placeholder="${placeholder}"
                    autocomplete="off"
                    style="width: 100%; padding: 6px 32px 6px 8px; margin-top: 4px; border: 1px solid #ced4da; border-radius: 4px;">
                <button type="button"
                    onclick="toggleDropdown('${uid}')"
                    style="margin-top: 4px; padding: 0 8px; border: 1px solid #ced4da; border-radius: 4px; background: #f8f9fa; cursor: pointer; font-size: 12px;">
                    ▼
                </button>
            </div>
            <div id="dropdown-${uid}" style="
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ced4da;
                border-radius: 4px;
                max-height: 180px;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
                ${opcionesHTML.length ? opcionesHTML : '<div style="padding: 8px 12px; color: #999; font-size: 13px;">Sin stock disponible</div>'}
            </div>
        </div>`;
    }

    // === 4. CONSTRUIR HTML ===
    let html = '';

    const opcionesDecos = (stock.equipos || []).map(eq => eq.serie1).filter(Boolean);
    const opcionesTarjetas = (stock.tarjetas || []).map(t => t.serie).filter(Boolean);
    const opcionesLNB = (stock.lnbs || []).map(l => l.serie).filter(Boolean);

    // --- Decos + Tarjetas ---
    for (let i = 1; i <= numDecos; i++) {
        html += `
        <div data-deco-index="${i - 1}" style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 12px; ${
            decosObligatorios ? 'border-left: 4px solid #28a745;' : ''
        }">
            <label>Deco ${i}${decosObligatorios ? ' *' : ''}:</label>
            ${crearInputConDropdown({
                clase: 'input-serie-manual',
                dataTipo: 'equipo',
                dataIndex: i - 1,
                placeholder: 'Ingrese o seleccione serie',
                opciones: opcionesDecos,
                requerido: decosObligatorios
            })}

            <label style="margin-top: 10px; display: block;">Tarjeta ${i} (opcional):</label>
            ${crearInputConDropdown({
                clase: 'input-serie-manual',
                dataTipo: 'tarjeta',
                dataIndex: i - 1,
                placeholder: 'Ingrese o seleccione serie',
                opciones: opcionesTarjetas
            })}
        </div>`;
    }

    // --- LNB ---
    if (mostrarLNB) {
        html += `
        <h4 style="margin: 20px 0 10px; color: #6c757d; border-bottom: 2px solid #eee;">LNB (opcional)</h4>
        <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
            <label>Seleccionar LNB seriado:</label>
            ${crearInputConDropdown({
                id: 'input-lnb-liquidacion',
                clase: 'input-serie-manual',
                dataTipo: 'lnb',
                placeholder: 'Ingrese o seleccione serie',
                opciones: opcionesLNB
            })}
        </div>`;
    }
    // === EXTENSORES (nuevo) ===
    const numExtensores = extraerCantidadExtensores(subservicio);
    if (numExtensores > 0) {
        const opcionesExtensores = (stock.equipos || [])
            .filter(eq => {
                // ✅ Opcional: filtrar solo equipos que sean extensores según su código/nombre
                const articulo = appData.articulos.seriados.find(a => a.codigo === eq.articuloCodigo);
                return articulo?.nombre?.toLowerCase().includes('extensor') || 
                    articulo?.codigo?.toLowerCase().includes('ext');
            })
            .map(eq => eq.serie1)
            .filter(Boolean);

        html += `
        <h4 style="margin: 20px 0 10px; color: #6c757d; border-bottom: 2px solid #eee;">
            📡 Extensores (${numExtensores}) ${decosObligatorios ? '*' : '(Opcional)'}
        </h4>`;
        
        for (let i = 1; i <= numExtensores; i++) {
            html += `
            <div data-ext-index="${i - 1}" style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
                <label>Extensor ${i}${decosObligatorios ? ' *' : ''}: </label>
                ${crearInputConDropdown({
                    clase: 'input-serie-manual',
                    dataTipo: 'extensor',  // ✅ Nuevo tipo
                    dataIndex: i - 1,
                    placeholder: 'Ingrese o seleccione serie de extensor',
                    opciones: opcionesExtensores,
                    requerido: decosObligatorios
                })}
            </div>`;
        }
    }

    // --- Equipos y Tarjetas Retirados ---
    const esServicioConRetiro =
        servicio.includes('vt') ||
        servicio.includes('traslado') ||
        servicio.includes('regularizacion') ||
        servicio.includes('regularizar');

    if (esServicioConRetiro) {
        html += `
        <h4 style="margin: 20px 0 15px; color: #dc3545; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            Equipos y Tarjetas Retirados (opcional)
        </h4>
        <div style="display: flex; gap: 20px; margin-top: 10px;">
            <div style="flex: 1; background: #fef8f8; padding: 15px; border-radius: 6px; border: 1px solid #f8d7da;">
                <h5 style="margin-top: 0; margin-bottom: 15px; color: #dc3545; font-size: 1em;">Equipos</h5>
                <div style="display: flex; flex-direction: column; gap: 10px;">`;
        for (let i = 1; i <= 5; i++) {
            html += `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border: 1px solid #ced4da; border-radius: 6px;">
                    <label style="font-weight: 500; color: #333; min-width: 100px; text-align: right;">Deco ${i}:</label>
                    <input type="text" class="input-serie-salida" data-salida-index="${i - 1}"
                        placeholder="Serie Deco ${i}"
                        style="flex: 1; padding: 8px; border: none; outline: none; background: transparent;">
                </div>`;
        }
        html += `
                </div>
            </div>
            <div style="flex: 1; background: #fef8f8; padding: 15px; border-radius: 6px; border: 1px solid #f8d7da;">
                <h5 style="margin-top: 0; margin-bottom: 15px; color: #dc3545; font-size: 1em;">Tarjetas</h5>
                <div style="display: flex; flex-direction: column; gap: 10px;">`;
        for (let i = 1; i <= 5; i++) {
            html += `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border: 1px solid #ced4da; border-radius: 6px;">
                    <label style="font-weight: 500; color: #333; min-width: 100px; text-align: right;">Tarjeta ${i}:</label>
                    <input type="text" class="input-tarjeta-salida" data-salida-index="${i - 1}"
                        placeholder="Serie Tarjeta ${i}"
                        style="flex: 1; padding: 8px; border: none; outline: none; background: transparent;">
                </div>`;
        }
        html += `</div></div></div>`;
    }

    document.getElementById('contenedor-series').innerHTML = html;

    // === VALIDACIÓN EN TIEMPO REAL ===
    // ✅ FIX: Set compartido entre validación y pre-llenado
    const valoresActuales = new Set();

    document.querySelectorAll('#contenedor-series .input-serie-manual').forEach(input => {
        input.addEventListener('blur', function () {
            const serie = this.value.trim();
            const prev = this.dataset.prevValue || '';
            if (!serie) {
                if (prev) valoresActuales.delete(prev);
                delete this.dataset.prevValue;
                verificarBotonLiquidacion();
                return;
            }
            if (!validarSerieExiste(serie, ordenId)) {
                mostrarToastFront(`La serie "${serie}" no existe en el sistema.`, 'error');
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                this.focus();
                verificarBotonLiquidacion();
                return;
            }
            const otros = Array.from(valoresActuales).filter(v => v !== prev);
            if (otros.includes(serie)) {
                mostrarToastFront(`La serie "${serie}" ya está seleccionada.`, 'error');
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                this.focus();
                verificarBotonLiquidacion();
                return;
            }
            if (prev) valoresActuales.delete(prev);
            valoresActuales.add(serie);
            this.dataset.prevValue = serie;
            verificarBotonLiquidacion();
        });
        input.addEventListener('focus', function () {
            this.dataset.prevValue = this.value.trim();
        });
        input.addEventListener('input', function () {
            const inputId = this.id || `input-equipo-${this.dataset.index}-${ordenId}`;
            filtrarDropdown(inputId, this.value);
            verificarBotonLiquidacion();
        });
    });

    // === PRE-LLENAR SERIES ===
    setTimeout(() => {
        if (orden.series_entrada?.length) {
            orden.series_entrada.forEach((serie, idx) => {
                const input = document.querySelector(
                    `#contenedor-series .input-serie-manual[data-tipo="equipo"][data-index="${idx}"]`
                );
                if (input && serie) {
                    input.value = serie;
                    input.dataset.prevValue = serie; // ✅ registrar como prevValue
                    valoresActuales.add(serie);       // ✅ registrar en el Set
                }
            });
        }
        if (orden.series_tarjetas?.length) {
            orden.series_tarjetas.forEach((serie, idx) => {
                if (!serie) return;
                const input = document.querySelector(
                    `#contenedor-series .input-serie-manual[data-tipo="tarjeta"][data-index="${idx}"]`
                );
                if (input) {
                    input.value = serie;
                    input.dataset.prevValue = serie; // ✅
                    valoresActuales.add(serie);       // ✅
                }
            });
        }
        if (orden.series_lnb?.length) {
            const inputLNB = document.getElementById('input-lnb-liquidacion');
            if (inputLNB) {
                inputLNB.value = orden.series_lnb[0];
                inputLNB.dataset.prevValue = orden.series_lnb[0]; // ✅
                valoresActuales.add(orden.series_lnb[0]);          // ✅
            }
        }
        if (orden.series_salida?.length) {
            const inputsSalida = document.querySelectorAll('#contenedor-series .input-serie-salida');
            orden.series_salida.forEach((serie, idx) => {
                if (inputsSalida[idx] && serie) inputsSalida[idx].value = serie;
            });
        }
        if (orden.series_salida_tarjetas?.length) {
            const inputsTarjetaSalida = document.querySelectorAll('#contenedor-series .input-tarjeta-salida');
            orden.series_salida_tarjetas.forEach((serie, idx) => {
                if (inputsTarjetaSalida[idx] && serie) inputsTarjetaSalida[idx].value = serie;
            });
        }
        verificarBotonLiquidacion();
    }, 100);
}

// === HELPERS DROPDOWN (consérvalos) ===
function toggleDropdown(inputId) {
    document.querySelectorAll('[id^="dropdown-"]').forEach(d => {
        if (d.id !== `dropdown-${inputId}`) d.style.display = 'none';
    });
    const dd = document.getElementById(`dropdown-${inputId}`);
    if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function seleccionarOpcionDropdown(inputId, valor) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.value = valor;
    const dd = document.getElementById(`dropdown-${inputId}`);
    if (dd) dd.style.display = 'none';
    input.dispatchEvent(new Event('blur'));
}

function filtrarDropdown(inputId, texto) {
    const dd = document.getElementById(`dropdown-${inputId}`);
    if (!dd) return;
    const opciones = dd.querySelectorAll('.dropdown-option');
    const filtro = texto.toLowerCase();
    let hayOpciones = false;
    
    opciones.forEach(op => {
        const coincide = op.dataset.value.toLowerCase().includes(filtro);
        op.style.display = coincide ? 'block' : 'none';
        if (coincide) hayOpciones = true;
    });
    dd.style.display = hayOpciones ? 'block' : 'none';
}

// Cerrar dropdowns al hacer click fuera
document.addEventListener('click', function(e) {
    if (!e.target.closest('[id^="dropdown-"]') &&
        !e.target.classList.contains('input-serie-manual') &&
        !e.target.closest('button[onclick^="toggleDropdown"]')) {
        document.querySelectorAll('[id^="dropdown-"]').forEach(d => d.style.display = 'none');
    }
});

// Toast frontal (para validaciones)
function mostrarToastFront(mensaje, tipo = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
        background: ${tipo === "error" ? "#dc3545" : tipo === "success" ? "#28a745" : "#17a2b8"}; 
        color: white; padding: 12px 20px; border-radius: 6px; z-index: 9999; font-weight: bold; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
}

// Validar si serie existe en sistema
function serieExisteEnIngresos(serie) {
    if (!serie) return false;
    const norm = normalizarSerie(serie);
    
    // Buscar en equipos
    for (const ing of appData.ingresosSeriados || []) {
        for (const eq of ing.equipos || []) {
            if (normalizarSerie(eq.serie1) === norm || normalizarSerie(eq.serie2) === norm) return true;
        }
    }
    return false;
}

/**
 * Guarda la liquidación de una orden en Supabase y rebaja el stock del técnico.
 * SOLO equipos seriados: Decos, Modem, Extensores (sin LNB ni tarjetas).
 * @param {string} ordenId - El ID de la orden a liquidar.
 */
async function guardarLiquidacion(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) {
        mostrarToast("❌ Orden no encontrada.", "error");
        return;
    }

    // === 1. VALIDAR CAMPOS OBLIGATORIOS ===
    const nombreRecibe = document.getElementById('nombre-recibe')?.value.trim();
    const telefonoContacto = document.getElementById('telefono-contacto')?.value.trim();
    const coordenadas = document.getElementById('coordenadas')?.value.trim();
    const observaciones = document.getElementById('liquidacion-observacion')?.value.trim();

    if (!nombreRecibe || !telefonoContacto || !coordenadas || !observaciones || observaciones.length < 5) {
        mostrarToast("❌ Complete todos los campos obligatorios.", "error");
        return;
    }

    // === 2. CAPTURAR FERRETERÍA ===
    const ferreteria = {
        conectores: document.getElementById('ferreteria-conectores')?.value || '0',
        cable: document.getElementById('ferreteria-cable')?.value || '0'
    };

    // === 3. BUSCAR TÉCNICO ===
    const tecnicoNombre = orden.tecnico?.trim();
    const tecnico = tecnicoNombre
        ? appData.empleados.find(emp => `${emp.nombre1} ${emp.apepaterno}`.trim() === tecnicoNombre)
        : null;

    if (!tecnico) {
        mostrarToast("❌ No se encontró el técnico asignado.", "error");
        return;
    }

    // === 4. CAPTURAR SERIES INSTALADAS (Decos + Modem + Extensores) ===
    const seriesEntrada = [];

    // --- Capturar equipos seriados por data-index (Decos/Modem) ---
    const inputsEquipo = document.querySelectorAll(
        '#contenedor-series .input-serie-manual[data-tipo="equipo"]'
    );
    
    inputsEquipo.forEach((input, idx) => {
        const valor = input.value.trim();
        if (!valor) {
            seriesEntrada.push(null); // mantener posición para indexación
            return;
        }
        // Extraer serie limpia (quitar prefijo si existe: "DECO-ABC123" → "ABC123")
        const partes = valor.split('-');
        const serie = partes.length > 1 ? partes[partes.length - 1].trim() : valor;
        
        // Validar que exista en stock del técnico
        const eq = tecnico.stock?.equipos?.find(e => e.serie1 === serie || e.serie2 === serie);
        seriesEntrada.push(eq ? eq.serie1 : null);
    });

    // Limpiar nulls del final (campos vacíos al final no cuentan)
    while (seriesEntrada.length > 0 && seriesEntrada[seriesEntrada.length - 1] === null) {
        seriesEntrada.pop();
    }

    // === CAPTURAR EXTENSORES INSTALADOS ===
    const seriesExtensores = [];
    const inputsExtensores = document.querySelectorAll(
        '#contenedor-series .input-serie-manual[data-tipo="extensor"]'
    );
    
    inputsExtensores.forEach((input) => {
        const valor = input.value.trim();
        if (!valor) return;
        
        const partes = valor.split('-');
        const serie = partes.length > 1 ? partes[partes.length - 1].trim() : valor;
        
        // Validar que exista en stock
        const eq = tecnico.stock?.equipos?.find(e => e.serie1 === serie);
        if (eq) seriesExtensores.push(eq.serie1);
    });

    // === 5. CAPTURAR SERIES RETIRADAS (equipos del cliente) ===
    const seriesSalida = [];
    document.querySelectorAll('#contenedor-series .input-serie-salida').forEach(input => {
        const v = input.value.trim();
        if (v) seriesSalida.push(v);
    });

    // Preparar arrays finales (sin nulls) para Supabase
    const seriesEntradaLimpias = seriesEntrada.filter(Boolean);
    const seriesExtensoresLimpias = seriesExtensores.filter(Boolean);

    // === 6. ACTUALIZAR ORDEN EN SUPABASE ===
    const { error: errOrd } = await supabase
        .from('ordenes')
        .update({
            estado: 'Liquidadas',
            nombre_recibe: nombreRecibe,
            telefono_contacto: telefonoContacto,
            coordenadas: coordenadas,
            observacion: observaciones,
            series_entrada: seriesEntradaLimpias.length ? seriesEntradaLimpias : null,
            series_extensores: seriesExtensoresLimpias.length ? seriesExtensoresLimpias : null,
            series_salida: seriesSalida.length ? seriesSalida : null,
            ferreteria: ferreteria,
            puntaje_liquidado: orden.puntaje || 0
        })
        .eq('id', ordenId);

    if (errOrd) {
        console.error("Error al liquidar:", errOrd);
        mostrarToast("❌ Error al guardar orden.", "error");
        return;
    }

    // === 7. ELIMINAR SERIES DEL STOCK DEL TÉCNICO ===
    const eliminarDelStock = async (seriesArr) => {
        if (!seriesArr.length) return;
        
        const { data: asignaciones } = await supabase
            .from('asignaciones')
            .select('*')
            .eq('tecnico_id', tecnico.id)
            .eq('tipo', 'equipo');

        if (!asignaciones?.length) return;

        for (const asig of asignaciones) {
            const nuevasSeries = asig.series.filter(s => {
                const s1 = (typeof s === 'object' && s !== null) ? s.serie1 : s;
                return !seriesArr.includes(s1);
            });
            
            if (nuevasSeries.length === 0) {
                await supabase.from('asignaciones').delete().eq('id', asig.id);
            } else {
                await supabase.from('asignaciones').update({ series: nuevasSeries }).eq('id', asig.id);
            }
        }
    };

    // Eliminar equipos instalados y extensores del stock
    await eliminarDelStock([...seriesEntradaLimpias, ...seriesExtensoresLimpias]);

    // === 8. ACTUALIZAR MEMORIA LOCAL ===
    if (tecnico.stock?.equipos) {
        const seriesUsadas = new Set([...seriesEntradaLimpias, ...seriesExtensoresLimpias]);
        tecnico.stock.equipos = tecnico.stock.equipos.filter(eq => !seriesUsadas.has(eq.serie1));
    }

    // === 9. ACTUALIZAR ORDEN EN MEMORIA LOCAL ===
    const ordenLocal = ordenes.find(o => o.id === ordenId);
    if (ordenLocal) {
        ordenLocal.estado = 'Liquidadas';
        ordenLocal.nombre_recibe = nombreRecibe;
        ordenLocal.telefono_contacto = telefonoContacto;
        ordenLocal.coordenadas = coordenadas;
        ordenLocal.observacion_liquidacion = observaciones;
        ordenLocal.series_entrada = seriesEntradaLimpias;
        ordenLocal.series_extensores = seriesExtensoresLimpias;
        ordenLocal.series_salida = seriesSalida;
        ordenLocal.ferreteria = ferreteria;
    }

    // === 10. CERRAR Y REFRESCAR ===
    document.getElementById('modal-liquidacion').style.display = 'none';
    mostrarToast("✅ Orden liquidada exitosamente.", "success");

    if (document.getElementById('panel-agendadas')?.classList.contains('active')) {
        aplicarFiltros();
    }
    if (document.getElementById('panel-liquidadas')?.classList.contains('active')) {
        renderTablaLiquidadas();
    }
}

// ================================
// --- MODAL DE LIQUIDACIÓN ---
// ================================

/**
 * Abre el modal de liquidación para una orden específica
 * @param {string} ordenId - El ID de la orden a liquidar
 */
function abrirModalLiquidacion(ordenId) {
    // ✅ VALIDAR ROL LECTOR
    if (window.usuarioActivo?.rol === 'lector') {
        mostrarToast("⛔ Rol 'Lector' no puede liquidar órdenes.", "error");
        return;
    }

    const modal = document.getElementById('modal-liquidacion');
    
    // ✅ Validar que el modal exista en el DOM
    if (!modal) {
        console.error("❌ Modal de liquidación no encontrado en el DOM.");
        mostrarToast("Error: Modal no disponible.", "error");
        return;
    }

    // ✅ Buscar la orden en memoria local
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) {
        console.error(`❌ Orden con ID ${ordenId} no encontrada.`);
        mostrarToast("Error: Orden no encontrada.", "error");
        return;
    }

    // ✅ Validación previa: Técnico y Despacho asignados
    if (!orden.tecnico || !orden.despacho) {
        return mostrarToast("❌ Falta asignar Técnico o Despacho.", "error");
    }

    // === 1. LLENAR TÍTULO DEL MODAL ===
    const titulo = document.getElementById('liquidar-numero-orden');
    if (titulo) titulo.textContent = orden.numero;

    // === 2. LIMPIAR CAMPOS (incluyendo ferretería) ===
    const campos = ['nombre-recibe', 'telefono-contacto', 'coordenadas', 'liquidacion-observacion'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    // Limpiar ferretería
    ['ferreteria-conectores', 'ferreteria-cable'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['ferreteria-lnb', 'ferreteria-antena'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const contenedorSeries = document.getElementById('contenedor-series');
    if (contenedorSeries) contenedorSeries.innerHTML = '';

    // === 3. PRE-LLENAR CAMPOS CON DATOS EXISTENTES (si los hay) ===
    if (orden.nombre_recibe) {
        const el = document.getElementById('nombre-recibe');
        if (el) el.value = orden.nombre_recibe;
    }
    if (orden.telefono_contacto) {
        const el = document.getElementById('telefono-contacto');
        if (el) el.value = orden.telefono_contacto;
    }
    if (orden.coordenadas) {
        const el = document.getElementById('coordenadas');
        if (el) el.value = orden.coordenadas;
    }
    if (orden.observacion_liquidacion) {
        const el = document.getElementById('liquidacion-observacion');
        if (el) el.value = orden.observacion_liquidacion;
    }
    // Pre-llenar ferretería si la orden ya tiene datos
    if (orden.ferreteria && typeof orden.ferreteria === 'object') {
        const f = orden.ferreteria;
        const fc = document.getElementById('ferreteria-conectores');
        const fca = document.getElementById('ferreteria-cable');
        if (fc && f.conectores) fc.value = f.conectores;        
        if (fca && f.cable) fca.value = f.cable;        
    }

    // === FECHA AUTOMÁTICA ===
    const fechaHoy = new Date().toISOString().split('T')[0];
    // Si existe el campo, lo ocultamos y seteamos el valor
    const fechaInput = document.getElementById('liquidacion-fecha');
    if (fechaInput) {
        fechaInput.value = fechaHoy;
        fechaInput.style.display = 'none'; // ✅ Ocultar visualmente
        // Opcional: agregar campo oculto si necesitas enviarlo
        if (!fechaInput.hasAttribute('type')) {
            fechaInput.type = 'hidden';
        }
    }

    // === 4. RENDERIZAR FORMULARIO DE SERIES ===
    renderFormularioLiquidacion(ordenId);

    // === 5. AGREGAR LISTENERS PARA VALIDACIÓN EN TIEMPO REAL ===
    ['nombre-recibe', 'telefono-contacto', 'coordenadas', 'liquidacion-observacion'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
        // Remover listeners previos para evitar duplicados
        el.removeEventListener('input', verificarBotonLiquidacion);
        el.addEventListener('input', verificarBotonLiquidacion);
        }
    });

    // === 6. CONFIGURAR BOTÓN CONFIRMAR ===
    const btnConfirmar = document.getElementById('btn-confirmar-liquidacion');
    if (btnConfirmar) {
        // Guardar ordenId en dataset para referencia
        btnConfirmar.dataset.ordenId = ordenId;
        
        // Clonar y reemplazar para evitar listeners duplicados
        const nuevoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
        
        // Asignar evento click
        document.getElementById('btn-confirmar-liquidacion').addEventListener('click', () => {
        guardarLiquidacion(ordenId);
        }, { once: true });
    }

    // === 7. CONFIGURAR CIERRE DEL MODAL ===
    const cerrarModal = () => { 
        modal.style.display = 'none'; 
    };
    
    const btnCerrar = document.getElementById('cerrar-modal-liquidacion');
    const btnCancelar = document.getElementById('btn-cancelar-liquidacion');
    
    if (btnCerrar) {
        btnCerrar.removeEventListener('click', cerrarModal);
        btnCerrar.addEventListener('click', cerrarModal, { once: true });
    }
    if (btnCancelar) {
        btnCancelar.removeEventListener('click', cerrarModal);
        btnCancelar.addEventListener('click', cerrarModal, { once: true });
    }

    // === 8. MOSTRAR MODAL ===
    modal.style.display = 'flex';
    
    // === 9. VALIDAR ESTADO INICIAL DEL BOTÓN ===
    if (typeof verificarBotonLiquidacion === 'function') {
        verificarBotonLiquidacion();
    }
}

function generarCamposSeries(orden) {
    const contenedor = document.getElementById('contenedor-series');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; 

    const servicio = (orden.servicio || '').toLowerCase();
    const subServicio = (orden.subservicio || orden.subServicio || '').toLowerCase();
    
    let cantidadDecos = 0;
    let cantidadLNB = 0;
    let decosObligatorios = false;

    const extraerNumero = (str) => {
        const match = str.match(/(\d+)/);
        return match ? parseInt(match[0]) : 1;
    };

    // Aplicación de reglas según tu pauta
    if (servicio.includes('instalación') || servicio.includes('instalacion')) {
        cantidadDecos = extraerNumero(subServicio) || 1;
        cantidadLNB = 1;
        decosObligatorios = true;
    } else if (servicio.includes('adicional')) {
        cantidadDecos = extraerNumero(subServicio) || 1;
        decosObligatorios = true;
    } else if (servicio.includes('vt') || servicio.includes('visita') || 
            servicio.includes('traslado') || servicio.includes('regularizar')) {
        cantidadDecos = 5; 
        cantidadLNB = 1;
        decosObligatorios = false; 
    }

    let htmlContent = '';

    // Generar inputs usando tus clases .form-group y .form-control
    for (let i = 1; i <= cantidadDecos; i++) {
        const asterisco = decosObligatorios ? '<span style="color:red">*</span>' : '(Opcional)';
        const claseValidacion = decosObligatorios ? 'input-obligatorio' : 'input-opcional';

        htmlContent += `
            <div class="serie-item-container" style="border-bottom: 1px solid #eee; margin-bottom: 15px; padding-bottom: 2px;">
                <div class="form-group">
                    <label>Deco ${i} ${asterisco}</label>
                    <input type="text" class="form-control input-serie-deco ${claseValidacion}" 
                    placeholder="Serie Deco ${i}">
                </div>
                <div class="form-group">
                    <label>Tarjeta ${i} (Opcional)</label>
                    <input type="text" class="form-control input-serie-card" 
                    placeholder="Serie Tarjeta ${i}">
                </div>
            </div>
        `;
    }

    if (cantidadLNB > 0) {
        htmlContent += `
            <div class="form-group">
                <label>Serie LNB (Opcional)</label>
                <input type="text" class="form-control input-serie-lnb" placeholder="Serie LNB">
            </div>
        `;
    }

    contenedor.innerHTML = htmlContent;

    // Reconectar la validación del botón
    const inputs = contenedor.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', verificarBotonLiquidacion);
    });
}

// Cerrar modal
document.getElementById('cerrar-modal-liquidacion')?.addEventListener('click', () => {
    document.getElementById('modal-liquidacion').style.display = 'none';
});

document.getElementById('btn-cancelar-liquidacion')?.addEventListener('click', () => {
    document.getElementById('modal-liquidacion').style.display = 'none';
});

// Confirmar liquidación


function verificarBotonLiquidacion() {
    const btnConfirmar = document.getElementById('btn-confirmar-liquidacion');
    if (!btnConfirmar) return;

    // --- 1. Validar campos de contacto (siempre obligatorios) ---
    const nombre = document.getElementById('nombre-recibe')?.value.trim();
    const telefono = document.getElementById('telefono-contacto')?.value.trim();
    const coordenadas = document.getElementById('coordenadas')?.value.trim();
    const obs = document.getElementById('liquidacion-observacion')?.value.trim();

    const datosContactoCompletos = nombre && telefono && coordenadas && obs && obs.length >= 5;

    // --- 2. Determinar si se requieren series (solo para Instalación/Adicional) ---
    const ordenId = btnConfirmar.dataset.ordenId; // Asegúrate de que el modal guarde este dato
    const orden = ordenes.find(o => o.id === ordenId);
    let seriesRequeridas = false;
    let seriesValidas = true;

    if (orden) {
        const servicio = (orden.servicio || '').toLowerCase();
        const subservicio = (orden.subservicio || '').toLowerCase();
        const esInstalacionOAdicional = servicio.includes('instalacion') || servicio.includes('adicional');

        if (esInstalacionOAdicional) {
        seriesRequeridas = true;
        // Extraer cantidad mínima de decos
        const extraerNumero = (str) => {
            const match = str.match(/(\d+)/);
            return match ? parseInt(match[0]) : 1;
        };
        const numDecosReq = extraerNumero(subservicio) || 1;
        const seriesEntrada = Array.from(document.querySelectorAll('#contenedor-series .input-serie-manual[data-tipo="equipo"]'))
            .map(input => input.value.trim())
            .filter(v => v);
        seriesValidas = seriesEntrada.length >= numDecosReq;
        }
        // Para VT, Traslado, etc.: NO se requieren series → seriesValidas = true
    }

    // --- 3. Activar/desactivar botón ---
    const habilitado = datosContactoCompletos && seriesValidas;

    btnConfirmar.disabled = !habilitado;
    btnConfirmar.style.width = '200px';
    btnConfirmar.style.padding = '12px 0';
    btnConfirmar.style.border = 'none';
    btnConfirmar.style.borderRadius = '8px';
    btnConfirmar.style.fontSize = '15px';
    btnConfirmar.style.fontWeight = '600';
    btnConfirmar.style.color = 'white';
    btnConfirmar.style.cursor = habilitado ? 'pointer' : 'not-allowed';

    if (habilitado) {
        btnConfirmar.textContent = '✅ Liquidar Orden';
        btnConfirmar.style.backgroundColor = '#28a745';
        btnConfirmar.style.opacity = '1';
    } else {
        btnConfirmar.textContent = '❌ Faltan datos...';
        btnConfirmar.style.backgroundColor = '#6c757d';
        btnConfirmar.style.opacity = '0.6';
    }
}



// === FUNCIÓN DE PRUEBA (accede a la variable global `supabase`) ===
async function pruebaSupabase() {
    if (!supabase) {
        mostrarToast('❌ Supabase no inicializado. Verifica la consola.', 'error');
        console.error('Supabase es null o undefined');
        return;
    }
    try {
        const { data, error } = await supabase.from('ordenes').select('*').limit(1);
        if (error) throw error;
        mostrarToast('✅ Conexión a Supabase OK', 'success');
        console.log('Ejemplo de dato:', data[0]);
    } catch (err) {
        console.error('❌ Error al conectar con Supabase:', err);
        mostrarToast('Error: ' + (err.message || 'Falló la conexión'), 'error');
    }
}

/**
 * Procesa un archivo Excel para asignación masiva de materiales a técnicos.
 * El Excel debe contener columnas: nombre_tecnico (o rut_tecnico) y serie.
 */
async function procesarAsignacionMasiva(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            if (jsonData.length === 0) {
            reject("El archivo está vacío.");
            return;
            }

            const columnas = Object.keys(jsonData[0]).map(k => k.toLowerCase());

            // Determinar si usa nombre o RUT
            const usaRut = columnas.some(col => col.includes('rut'));
            const usaNombre = columnas.some(col => col.includes('nombre'));

            if (!usaRut && !usaNombre) {
            reject("El archivo debe contener 'nombre_tecnico' o 'rut_tecnico'.");
            return;
            }

            // Normalizar columnas
            const items = jsonData.map(row => {
            const keys = Object.keys(row);
            let identificador = '';
            let serie = '';

            for (const key of keys) {
                const k = key.toLowerCase();
                const valor = String(row[key]).trim();
                if (k.includes('serie')) {
                serie = valor;
                } else if ((usaRut && k.includes('rut')) || (usaNombre && k.includes('nombre'))) {
                identificador = valor;
                }
            }

            return { identificador, serie };
            }).filter(item => item.identificador && item.serie);

            if (items.length === 0) {
            reject("No se encontraron filas válidas con técnico y serie.");
            return;
            }

            resolve({ items, usaRut });
        } catch (err) {
        reject("Error al leer el archivo: " + (err.message || err));
    }
    };
    reader.onerror = () => reject("Error al cargar el archivo.");
    reader.readAsArrayBuffer(file);
    });
}

/**
 * Agrupa las series por técnico y las asigna.
 */
async function ejecutarAsignacionMasiva() {
    const fileInput = document.getElementById('archivo-asignacion-masiva');
    if (!fileInput.files[0]) {
    mostrarToast("Seleccione un archivo Excel.", "error");
    return;
    }

    try {
    const { items, usaRut } = await procesarAsignacionMasiva(fileInput.files[0]);

    // Agrupar por técnico
    const asignacionesPorTecnico = {};
    for (const item of items) {
    const emp = usaRut
        ? appData.empleados.find(e => normalizarRut(e.rut) === normalizarRut(item.identificador))
        : appData.empleados.find(e =>
            `${e.nombre1} ${e.apepaterno}`.toLowerCase() === item.identificador.toLowerCase()
        );

    if (!emp) {
        mostrarToast(`Técnico no encontrado: ${item.identificador}`, "error");
        continue;
    }

    if (!asignacionesPorTecnico[emp.id]) {
        asignacionesPorTecnico[emp.id] = {
            tecnico: emp,
            series: []
        };
        }
        asignacionesPorTecnico[emp.id].series.push(item.serie);
    }

    if (Object.keys(asignacionesPorTecnico).length === 0) {
        mostrarToast("No se pudo asignar a ningún técnico.", "error");
        return;
    }

    // ✅ VALIDAR SOLO SERIES QUE YA ESTÁN ASIGNADAS A OTRO TÉCNICO O INSTALADAS EN CLIENTES
    const seriesAsignadasOInstaladas = new Set();

    // 1. Series asignadas a técnicos (incluyendo las que ya están en stock)
    appData.empleados.forEach(e => {
        (e.stock?.equipos || []).forEach(eq => {
            seriesAsignadasOInstaladas.add(normalizarSerie(eq.serie1));
            if (eq.serie2) seriesAsignadasOInstaladas.add(normalizarSerie(eq.serie2));
        });
        (e.stock?.tarjetas || []).forEach(t => {
            seriesAsignadasOInstaladas.add(normalizarSerie(t.serie));
        });
        (e.stock?.lnbs || []).forEach(l => {
            seriesAsignadasOInstaladas.add(normalizarSerie(l.serie));
        });
    });

    // 2. Series instaladas en órdenes liquidadas
    ordenes.forEach(o => {
        if (o.estado === 'Liquidadas') {
            // Equipos
            if (Array.isArray(o.series_entrada)) {
                o.series_entrada.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) seriesAsignadasOInstaladas.add(normalizarSerie(serie));
                });
            }
            // Tarjetas
            if (Array.isArray(o.series_tarjetas)) {
                o.series_tarjetas.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) seriesAsignadasOInstaladas.add(normalizarSerie(serie));
                });
            }
            // LNBs
            if (Array.isArray(o.series_lnb)) {
                o.series_lnb.forEach(item => {
                    const serie = typeof item === 'object' ? item.serie : item;
                    if (serie) seriesAsignadasOInstaladas.add(normalizarSerie(serie));
                });
            }
        }
    });

    // Verificar duplicados contra el conjunto de series asignadas o instaladas
    for (const [tecId, info] of Object.entries(asignacionesPorTecnico)) {
        const duplicadas = info.series.filter(s => seriesAsignadasOInstaladas.has(normalizarSerie(s)));
        if (duplicadas.length > 0) {
            mostrarToast(`Serie(s) duplicada(s) para ${info.tecnico.nombre1}: ${duplicadas.join(', ')}`, "error");
            return;
        }
    }

        // ✅ GUARDAR EN SUPABASE: Corregido para enviar 'tipo' y 'articulo_codigo'
    for (const [tecId, info] of Object.entries(asignacionesPorTecnico)) {
        // --- 1. Definimos las variables para 'tipo' y 'articuloCodigo' en este ámbito ---
        let tipo = null;
        let articuloCodigo = null;
        const seriesParaBD = [];

        // --- 2. Procesamos cada serie para construir el array y determinar tipo/artículo ---
        for (let i = 0; i < info.series.length; i++) {
        const serie = info.series[i];
        const serieNormalizada = normalizarSerie(serie);

        // Buscar el tipo y código del artículo en los ingresos
        let encontrada = false;

        // --- Buscar en Equipos ---
        for (const ingreso of appData.ingresosSeriados) {
        const eq = (ingreso.equipos || []).find(e => e.serie1 === serieNormalizada || e.serie2 === serieNormalizada);
            if (eq) {
            tipo = 'equipo';
            articuloCodigo = ingreso.articulo_codigo;
            encontrada = true;
            break;
            }
        }
        // --- Buscar en Tarjetas ---
        if (!encontrada) {
            for (const ingreso of appData.ingresosTarjetas) {
            const t = (ingreso.tarjetas || []).find(t => t.serie === serieNormalizada);
            if (t) {
                tipo = 'tarjeta';
                articuloCodigo = ingreso.articulo_codigo;
                encontrada = true;
                break;
                }
            }
        }
        // --- Buscar en LNBs ---
        if (!encontrada) {
            for (const ingreso of appData.ingresosLNB) {
            const l = (ingreso.lnbs || []).find(l => l.serie === serieNormalizada);
            if (l) {
                tipo = 'lnb';
                articuloCodigo = ingreso.articulo_codigo;
                encontrada = true;
                break;
                }
            }
        }
        // --- Buscar en el Stock de Técnicos (fallback) ---
        if (!encontrada) {
            for (const emp of appData.empleados) {
            const eq = emp.stock?.equipos?.find(e => e.serie1 === serieNormalizada || e.serie2 === serieNormalizada);
            if (eq) {
                tipo = 'equipo';
                articuloCodigo = eq.articuloCodigo;
                encontrada = true;
                break;
            }
            const t = emp.stock?.tarjetas?.find(t => t.serie === serieNormalizada);
            if (t) {
                tipo = 'tarjeta';
                articuloCodigo = t.articuloCodigo;
                encontrada = true;
                break;
            }
            const l = emp.stock?.lnbs?.find(l => l.serie === serieNormalizada);
            if (l) {
                tipo = 'lnb';
                articuloCodigo = l.articuloCodigo;
                encontrada = true;
                break;
            }
            }
        }

        if (!encontrada) {
            throw new Error(`La serie "${serie}" no se encuentra registrada en el sistema.`);
        }

        // --- Validación: Todas las series deben ser del mismo tipo y artículo ---
        if (i > 0) {
            const primerTipo = tipo; 
            const primerArticulo = articuloCodigo;
        }

        // --- Formatear la serie ---
        if (tipo === 'equipo') {
            seriesParaBD.push({ serie1: serieNormalizada });
        } else {
            seriesParaBD.push({ serie: serieNormalizada });
        }
    }

    // --- 3. AHORA SÍ: 'tipo' y 'articuloCodigo' están definidos y listos para usar ---
    const guia = `MASIVA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    function obtenerFechaLocal() {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const fecha = obtenerFechaLocal(); 

    const { error } = await supabase.from('asignaciones').insert([{
        tipo: tipo, // ✅ Ahora esto tiene un valor válido
        articulo_codigo: articuloCodigo, // ✅ Ahora esto tiene un valor válido
        series: seriesParaBD,
        tecnico_id: tecId,
        fecha: fecha,
        guia_salida: guia
    }]);

    if (error) {
        throw error;
        }
    }

    mostrarToast(`✅ Asignación masiva completada para ${Object.keys(asignacionesPorTecnico).length} técnicos.`, "success");
    fileInput.value = '';
    await cargarDatos(); // Refrescar datos locales
    } catch (err) {
    console.error("Error en asignación masiva:", err);
    mostrarToast("❌ " + (err.message || err), "error");
    }
}

function aplicarFiltros() {
    
    const inputBuscador = document.getElementById('filtro-buscador');
    const termino = (inputBuscador?.value.trim().toLowerCase()) || '';
    const tecnico = document.getElementById('filtro-tecnico')?.value || '';
    const regionKey = document.getElementById('filtro-region')?.value || ''; // ✅ Cambiado a regionKey
    const comuna = document.getElementById('filtro-comuna')?.value || '';
    const servicio = document.getElementById('filtro-servicio')?.value || '';
    const fecha = document.getElementById('filtro-fecha')?.value || '';
    
    // ✅ 1. Filtrar órdenes agendadas PRIMERO por estado y buscador general
    let resultados = ordenes.filter(o => {
        // Verificar que sea agendada
        if (o.estado !== 'Agendada') return false;
        // Si no hay término de búsqueda, incluir todas
        if (termino === '') return true;
        // Buscar en múltiples campos
        const numero = (o.numero || '').toLowerCase();
        const rut = (o.rut_cliente || '').toLowerCase();
        const nombre = (o.nombre_cliente || '').toLowerCase();
        return numero.includes(termino) ||
            rut.includes(termino) ||
            nombre.includes(termino);
    });
    
    // ✅ 2. Luego aplicar los filtros específicos SOBRE los resultados ya filtrados
    if (tecnico !== '') {
        resultados = resultados.filter(o => o.tecnico === tecnico);
    }
    
    // ✅ CORRECCIÓN: Comparar usando el nombre de la región
    if (regionKey !== '') {
        const regionNombre = appData.regiones[regionKey]?.nombre;
        if (regionNombre) {
            resultados = resultados.filter(o => o.region === regionNombre);
        }
    }
    
    if (comuna !== '') {
        resultados = resultados.filter(o => o.comuna === comuna);
    }
    if (servicio !== '') {
        resultados = resultados.filter(o => o.servicio === servicio);
    }
    if (fecha !== '') {
        resultados = resultados.filter(o => o.fecha === fecha);
    }
    
    // ✅ 3. Ordenar por fecha: de la más antigua a la más nueva
    resultados.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaA - fechaB;
    });
    
    console.log(`🔍 Filtro región: ${regionKey} | Resultados: ${resultados.length} órdenes`);
    
    // ✅ 5. Actualizar la tabla
    renderTablaAgendadas(resultados);
}

function toggleDropdownDespacho(event, ordenId) {
    event.stopPropagation();
    
    // 🔍 DEBUG: Verificar que ambos botones existen
    const dropdown = document.getElementById(`dropdown-${ordenId}`);
    if (dropdown) {
        const btnLiquidar = dropdown.querySelector('.btn-liquidar');
        const btnRechazar = dropdown.querySelector('.btn-rechazar');
        console.log('🔍 Dropdown:', ordenId);
        console.log('✅ Btn Liquidar:', btnLiquidar ? 'EXISTS' : 'MISSING');
        console.log('❌ Btn Rechazar:', btnRechazar ? 'EXISTS' : 'MISSING');
        
        // Cerrar todos los demás dropdowns
        document.querySelectorAll('.dropdown-content-despacho').forEach(dd => {
            if (dd.id !== `dropdown-${ordenId}`) {
                dd.style.display = 'none';
            }
        });
        
        // Alternar el actual
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        
        // Posicionamiento
        const btn = event.target;
        const rect = btn.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + scrollY) + 'px';
        dropdown.style.left = (rect.right - 160 + scrollX) + 'px';
        dropdown.style.zIndex = '99999';
    }
}

function setupRutListeners() {
    ['orden-rut', 'emp-rut', 'editar-rut'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => formatearRut(e.target));
            el.addEventListener('blur', (e) => validarRutInput(e.target));
        }
    });
}

// =======================================================
// === FUNCIONES AUXILIARES DE RUT  ===
// =======================================================
/**
 * Formatea el RUT mientras se escribe (sin validar)
 * Se ejecuta en evento 'input'
 */
function formatearRut(inputElement) {
    if (!inputElement) return;
    
    // Solo números y K, sin puntos ni guiones
    let valor = inputElement.value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (!valor) {
        inputElement.value = '';
        return;
    }
    
    // Separar cuerpo y DV
    let cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1);
    
    // Aplicar formato: 12345678-0
    inputElement.value = cuerpo + '-' + dv;
    
    // ✅ IMPORTANTE: No validar aquí, solo formatear
    inputElement.classList.remove('valid', 'invalid');
}

/**
 * Valida el RUT y muestra feedback visual
 * Se ejecuta SOLO en evento 'blur'
 */
function validarRutInput(inputElement) {
    if (!inputElement) return;
    
    // Si está vacío, no mostrar error
    if (!inputElement.value.trim()) {
        inputElement.classList.remove('valid', 'invalid');
        return;
    }
    
    const esValido = validarRutChileno(inputElement.value);
    
    // Remover clases previas
    inputElement.classList.remove('valid', 'invalid');
    
    // Agregar clase según resultado
    if (esValido) {
        inputElement.classList.add('valid');
    } else {
        inputElement.classList.add('invalid');
    }
}

// ================= FLORA =================
async function renderFlota(vista) {
    const tbody = document.getElementById(vista === 'km' ? 'tabla-flota-km' : vista === 'prox' ? 'tabla-flota-prox' : 'tabla-flota-actual');
    if(!tbody) return;
    
    // Simula carga desde Supabase o appData
    const datos = appData.flota || []; 
    tbody.innerHTML = '';
    
    if(datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center; color:#666;">No hay registros</td></tr>';
        return;
    }

    datos.forEach(v => {
        if(vista === 'km') {
            tbody.innerHTML += `<tr><td style="padding:10px;">${v.patente}</td><td>${v.marca} ${v.modelo}</td><td>${v.km_actual}</td><td><span style="padding:4px 8px; border-radius:12px; font-size:12px; background:${v.estado==='Activo'?'#d1fae5':'#fee2e2'}">${v.estado}</span></td><td><button onclick="editarFlota('${v.id}')" style="color:#007bff; background:none; border:none; cursor:pointer;">✏️</button></td></tr>`;
        } else if(vista === 'prox') {
            const kmRestante = v.km_prox_revision - v.km_actual;
            tbody.innerHTML += `<tr><td style="padding:10px;">${v.patente}</td><td>${v.marca} ${v.modelo}</td><td>${v.km_actual}</td><td>${v.km_prox_revision}</td><td>${kmRestante < 500 ? '⚠️ Urgente' : '✅ OK'}</td></tr>`;
        } else {
            tbody.innerHTML += `<tr><td style="padding:10px;">${v.patente}</td><td>${v.marca} ${v.modelo}</td><td style="font-weight:bold;">${v.km_actual} km</td><td>${v.ultima_actualizacion || '—'}</td></tr>`;
        }
    });
}

async function guardarFlota(datos) {
    // Aquí va tu insert a Supabase
    const { error } = await supabase.from('flota').insert([datos]);
    if(error) return mostrarToast('❌ Error al guardar', 'error');
    
    appData.flota.push(datos);
    renderFlota('km');
    renderFlota('prox');
    renderFlota('actual');
    mostrarToast('✅ Vehículo registrado', 'success');
    cerrarModales();
}

// ================= PAÑOL =================
async function renderPañol(categoria) {
    const tbody = document.getElementById(`tabla-panol-${categoria}`);
    if(!tbody) return;
    const datos = appData.panol[categoria] || [];
    tbody.innerHTML = '';
    if(datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center; color:#666;">Sin stock</td></tr>';
        return;
    }
    datos.forEach(p => {
        tbody.innerHTML += `<tr><td style="padding:10px;">${p.nombre}</td><td>${p.codigo || p.talla}</td><td>${p.stock}</td><td>${p.ubicacion || p.vencimiento || p.entregados}</td><td><span style="padding:4px 8px; border-radius:12px; font-size:12px; background:${p.stock>0?'#d1fae5':'#fee2e2'}">${p.stock>0?'Disponible':'Agotado'}</span></td></tr>`;
    });
}

async function guardarPañol(categoria, datos) {
    const tabla = `panol_${categoria}`; // ej: panol_herramientas
    const { error } = await supabase.from(tabla).insert([datos]);
    if(error) return mostrarToast('❌ Error al guardar', 'error');
    
    appData.panol[categoria].push(datos);
    renderPañol(categoria);
    mostrarToast('✅ Item agregado al Pañol', 'success');
    cerrarModales();
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // =======================================================
        // === 1. INICIALIZACIÓN DE SUPABASE ===
        // =======================================================
        if (!supabase) {
            console.error('❌ Supabase no inicializado');
        } else {
            console.log('✅ Supabase inicializado correctamente');
        }

        // =======================================================
        // === 2. CARGAR DATOS INICIALES ===
        // =======================================================
        await cargarDatos();
        
        if (typeof poblarFiltrosReporte === 'function') {
            poblarFiltrosReporte();
        }
        // =======================================================
        // === 3. FUNCIÓN AUXILIAR PARA AGREGAR LISTENERS SEGURAMENTE ===
        // =======================================================
        const safeAddListener = (id, event, handler) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener(event, handler);
                console.log(`✅ Listener agregado: ${id} - ${event}`);
            }
        };
        
        // =======================================================
        // === 4. LISTENERS DE NAVEGACIÓN (MENÚS) ===
        // =======================================================
        document.querySelectorAll('#main-nav button[data-module]').forEach(button => {
            button.addEventListener('click', () => seleccionarModulo(button.dataset.module));
        });
        
        document.querySelectorAll('#sidebar button[data-panel]').forEach(button => {
            button.addEventListener('click', () => {
                const panelId = button.dataset.panel;
                mostrarPanel(panelId);
                
                // Lógica específica para ciertos paneles
                if (panelId === 'panel-ingreso-seriados' || panelId === 'panel-ingreso-no-seriados') {
                    cargarArticulosEnSelects();
                }
                
                if (panelId === 'panel-asignacion-materiales') {
                    document.getElementById('tecnico-asignacion').innerHTML = '<option value="">-- Cargando --</option>';
                    document.getElementById('tipo-asignacion').value = '';
                    document.getElementById('material-asignacion').innerHTML = '<option value="">-- Seleccione tipo --</option>';
                    document.getElementById('contenedor-cantidad').style.display = 'none';
                    document.getElementById('contenedor-ingreso-series').style.display = 'none';
                    document.getElementById('contenedor-asignar-final').style.display = 'none';
                    
                    setTimeout(() => {
                        try {
                            inicializarAsignacion();
                        } catch (err) {
                            console.error("❌ Error al inicializar asignación:", err);
                            mostrarToast("Error al cargar el panel de asignación.", "error");
                        }
                    }, 150);
                }
            });
        });
        
        // =======================================================
        // === 5. LISTENERS DE BOTONES PRINCIPALES ===
        // =======================================================
        safeAddListener('btnLogin', 'click', login);
        safeAddListener('btnCancelarIngreso', 'click', () => {
            if (confirm("¿Desea cancelar el ingreso de esta orden?")) {
                mostrarPanel('modulo-bienvenida');
            }
        });
        
        // =======================================================
        // === 6. LISTENERS DE BÚSQUEDA Y FILTROS ===
        // =======================================================
        safeAddListener('btnBuscarPorOrden', 'click', buscarPorOrden);
        safeAddListener('btnBuscarPorRut', 'click', buscarPorRut);
        safeAddListener('btnResetFiltros', 'click', resetFiltros);
        
        // Filtros de órdenes agendadas
        document.getElementById('filtro-tecnico')?.addEventListener('change', aplicarFiltros);
        document.getElementById('filtro-servicio')?.addEventListener('change', aplicarFiltros);
        document.getElementById('filtro-fecha')?.addEventListener('change', aplicarFiltros);
        
        // Búsqueda con debounce (500ms)
        let timeoutBusqueda = null;
        const buscador = document.getElementById('filtro-buscador');
        if (buscador) {
            buscador.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    aplicarFiltros();
                }
            });
            
            buscador.addEventListener('input', function() {
                clearTimeout(timeoutBusqueda);
                timeoutBusqueda = setTimeout(() => {
                    aplicarFiltros();
                }, 500);
            });
        }
        
        // =======================================================
        // === 7. LISTENERS DE GESTIÓN DE ÓRDENES ===
        // =======================================================
        safeAddListener('btn-eliminar-orden', 'click', () => {
            const numero = document.getElementById('eliminar-orden-numero')?.value.trim();
            if (!numero) return mostrarToast("Ingrese un número de orden.", "error");
            if (eliminarOrdenPorNumero(numero)) {
                document.getElementById('eliminar-orden-numero').value = '';
            }
        });
        
        safeAddListener('btn-reversar-orden', 'click', () => {
            const numero = document.getElementById('reversar-orden-numero')?.value.trim();
            if (!numero) return mostrarToast("Ingrese un número de orden.", "error");
            if (reversarOrdenPorNumero(numero)) {
                document.getElementById('reversar-orden-numero').value = '';
            }
        });
        
        // ✅ NUEVO: Listener para reversar orden desde panel de Despacho (solo Despacho N2)
        safeAddListener('btn-reversar-orden-despacho', 'click', () => {
            const numero = document.getElementById('reversar-orden-numero-despacho')?.value.trim();
            if (!numero) return mostrarToast("Ingrese un número de orden.", "error");
            if (reversarOrdenPorNumero(numero)) {
                document.getElementById('reversar-orden-numero-despacho').value = '';
            }
        });
        
        // === 8. LISTENERS DE ÓRDENES LIQUIDADAS ===
        // =======================================================
        safeAddListener('btnFiltrarLiquidadas', 'click', function() {
        const inicio = document.getElementById('filtro-liquida-inicio')?.value;
        const fin = document.getElementById('filtro-liquida-fin')?.value;
        
        if (!inicio || !fin) {
            mostrarToast("⚠️ Debe seleccionar ambas fechas.", "error");
            return;
        }
        
        // ✅ Validar rango máximo 31 días (misma lógica que en renderTablaLiquidadas)
        const fechaInicio = parseFechaLocal(inicio);
        const fechaFin = parseFechaLocal(fin);
        const diffDays = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 31) {
            mostrarToast(`❌ Rango máximo: 31 días. Actualmente: ${diffDays} días.`, "error");
            return;
        }
        
        renderTablaLiquidadas();
        });

        safeAddListener('btnLimpiarFiltroLiquidas', 'click', function() {
            document.getElementById('filtro-liquida-inicio').value = '';
            document.getElementById('filtro-liquida-fin').value = '';
            renderTablaLiquidadas();
        });

        safeAddListener('btnExportarExcelLiquidadas', 'click', () => exportarExcelPorEstado('Liquidadas'));
        
        // =======================================================
        // === 9. LISTENERS DE ÓRDENES RECHAZADAS ===
        // =======================================================
        safeAddListener('btnFiltrarRechazadas', 'click', function() {
            const inicio = document.getElementById('filtro-rechazo-inicio')?.value;
            const fin = document.getElementById('filtro-rechazo-fin')?.value;
            
            if (!inicio || !fin) {
                mostrarToast("⚠️ Debe seleccionar ambas fechas.", "error");
                return;
            }
            
            // ✅ Validar rango máximo 31 días (misma lógica que en renderTablaRechazadas)
            const fechaInicio = parseFechaLocal(inicio);
            const fechaFin = parseFechaLocal(fin);
            const diffDays = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 31) {
                mostrarToast(`❌ Rango máximo: 31 días. Actualmente: ${diffDays} días.`, "error");
                return;
            }
            
            renderTablaRechazadas();
        });
        
        safeAddListener('btnLimpiarFiltroRechazadas', 'click', () => limpiarFiltroPorFecha('Rechazada', renderTablaRechazadas));
        safeAddListener('btnExportarExcelRechazadas', 'click', () => exportarExcelPorEstado('Rechazada'));
        
        // =======================================================
        // === 10. LISTENERS DE COMUNICACIONES ===
        // =======================================================
        safeAddListener('btnEnviarCorreo', 'click', enviarPorCorreo);
        safeAddListener('btnEnviarWhatsapp', 'click', enviarPorWhatsapp);
        
        // =======================================================
        // === 11. LISTENERS DE EXPORTACIÓN ===
        // =======================================================
        safeAddListener('btnExportarExcel', 'click', exportarExcel);
        safeAddListener('btnAplicarFiltrosReporte', 'click', aplicarFiltros);
        safeAddListener('btnLimpiarFiltrosReporte', 'click', limpiarFiltrosReporte);
        safeAddListener('btnExportarReporteProduccion', 'click', exportarReporteProduccion);
        safeAddListener('exportarStockBodegaAExcel', 'click', exportarStockBodegaAExcel);
        
        // =======================================================
        // === 12. LISTENERS DE RRHH Y USUARIOS ===
        // =======================================================
        safeAddListener('btnBuscarColaborador', 'click', buscarColaborador);
        safeAddListener('btnAgregarCargo', 'click', agregarCargo);
        safeAddListener('btnCancelarEdicion', 'click', () => mostrarPanel('panel-lista-personal'));
        safeAddListener('btn-crear-usuario', 'click', guardarUsuario);
        
        const buscarColabInput = document.getElementById('buscar-colab-input');
        if (buscarColabInput) {
            buscarColabInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') buscarColaborador();
            });
        }
        
        // =======================================================
        // === 13. LISTENERS DE CREACIÓN DE ARTÍCULOS ===
        // =======================================================
        safeAddListener('btn-crear-seriado', 'click', () => mostrarFormularioCreacion('seriado'));
        safeAddListener('btn-crear-ferreteria', 'click', () => mostrarFormularioCreacion('ferreteria'));
        safeAddListener('btn-cancelar-crear', 'click', cancelarCreacion);        
        safeAddListener('btn-cancelar-crear-lnb', 'click', () => {
            document.getElementById('form-crear-lnb').style.display = 'none';
        });
        
        // =======================================================
        // === 14. LISTENERS DE BÚSQUEDA DE SERIES ===
        // =======================================================
        safeAddListener('btn-buscar-serie', 'click', buscarSerie);
        const inputSerie = document.getElementById('input-buscar-serie');
        if (inputSerie) {
            inputSerie.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') buscarSerie();
            });
        }
        
        // =======================================================
        // === 15. LISTENERS DE FORMULARIOS DE INGRESO ===
        // =======================================================
        const formIngresoOrden = document.getElementById('form-ingreso-orden');
        if (formIngresoOrden) formIngresoOrden.addEventListener('submit', guardarOrden);
        
        const formSeriados = document.getElementById('form-ingreso-seriados');
        if (formSeriados) formSeriados.addEventListener('submit', guardarIngresoSeriados);
        
        const formIngresoNoSeriados = document.getElementById('form-ingreso-no-seriados');
        if (formIngresoNoSeriados) formIngresoNoSeriados.addEventListener('submit', (e) => guardarIngresoNoSeriado('tarjeta', e));
        
        const formIngresoLNB = document.getElementById('form-ingreso-lnb');
        if (formIngresoLNB) formIngresoLNB.addEventListener('submit', (e) => guardarIngresoNoSeriado('lnb', e));
        
        const formNuevoIngreso = document.getElementById('form-nuevo-ingreso');
        if (formNuevoIngreso) formNuevoIngreso.addEventListener('submit', guardarNuevoEmpleado);
        
        const formEditarEmpleado = document.getElementById('form-editar-empleado');
        if (formEditarEmpleado) formEditarEmpleado.addEventListener('submit', guardarEdicionEmpleado);
        
        const formEditarOrden = document.getElementById('form-editar-orden');
        if (formEditarOrden) formEditarOrden.addEventListener('submit', guardarEdicionOrden);
        
        // =======================================================
        // === 16. LISTENERS DE ASIGNACIÓN DE MATERIALES ===
        // =======================================================
        safeAddListener('btn-asignacion-masiva', 'click', ejecutarAsignacionMasiva);
        
        const formAsignacion = document.getElementById('form-asignacion');
        if (formAsignacion) {
            formAsignacion.addEventListener('submit', guardarAsignacion);
        }
        
        // =======================================================
        // === 17. LISTENERS DE CREACIÓN DE LNB ===
        // =======================================================
        const formLNB = document.getElementById('form-crear-lnb');
        if (formLNB) {
            formLNB.addEventListener('submit', async function(e) {
                e.preventDefault();
                const nombre = document.getElementById('articulo-nombre-lnb').value.trim();
                const codigo = document.getElementById('articulo-codigo-lnb').value.trim();
                
                if (!nombre || !codigo) {
                    return mostrarToast("Nombre y código son obligatorios.", "error");
                }
                
                if (appData.articulos.lnbs.some(a => a.codigo === codigo)) {
                    return mostrarToast("El código ya existe. Debe ser único.", "error");
                }
                
                const nuevoLNB = {
                    id: `lnb-${Date.now()}`,
                    nombre,
                    codigo,
                    activo: true
                };
                
                appData.articulos.lnbs.push(nuevoLNB);
                
                // Guardar en Supabase
                await supabase.from('articulos').insert([
                    {
                        codigo: codigo,
                        nombre: nombre,
                        tipo: 'lnb',
                        activo: true
                    }
                ]);
                
                mostrarToast("✅ LNB creado con éxito.", "success");
                
                // Limpiar y ocultar
                e.target.reset();
                e.target.style.display = 'none';
                renderGestionEquipos();
            });
        }
        
        // =======================================================
        // === 18. LISTENERS DE FORMATO DE RUT ===
        // =======================================================
        ['orden-rut', 'emp-rut', 'editar-rut'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // ✅ Formatear mientras escribe (sin validar)
                el.addEventListener('input', (e) => formatearRut(e.target));
                
                // ✅ Validar SOLO al salir del campo
                el.addEventListener('blur', (e) => validarRutInput(e.target));
            }
        });

        // =======================================================
        // === 19. LISTENER DE LOGIN CON ENTER ===
        // =======================================================
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && document.getElementById('login-container').style.display !== 'none') {
                event.preventDefault();
                login();
            }
        });
        
        // =======================================================
        // === 20. LISTENERS DE REPORTES RRHH ===
        // =======================================================
        const reportesRRHH = document.querySelector('#reportes-rrhh .report-buttons');
        if (reportesRRHH) {
            reportesRRHH.addEventListener('click', (e) => {
                if (e.target.dataset.reportType) exportarExcelRRHH(e.target.dataset.reportType);
            });
        }
        
        // =======================================================
        // === 21. LISTENERS DE SALDO TÉCNICO ===
        // =======================================================
        const filtroTecnicoSaldo = document.getElementById('filtro-tecnico-saldo');
        if (filtroTecnicoSaldo && appData?.empleados) {
            // Cargar técnicos en el filtro
            const tecnicos = appData.empleados
                .filter(emp => emp.activo && appData.cargos.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre)))
                .map(emp => ({ value: emp.id, text: `${emp.nombre1} ${emp.apepaterno}` }))
                .sort((a, b) => a.text.localeCompare(b.text));
            
            if (typeof populateSelect === 'function') {
                populateSelect(filtroTecnicoSaldo, [{ value: '', text: 'Todos los técnicos' }, ...tecnicos]);
            }
            
            // Evento para filtrar al cambiar el técnico
            filtroTecnicoSaldo.addEventListener('change', function() {
                if (typeof renderizarSaldoTecnico === 'function') {
                    renderizarSaldoTecnico(this.value);
                } else {
                    renderSaldoTecnico();
                }
            });
        }
        
        // ✅ BOTÓN EXPORTAR EXCEL SALDO TÉCNICO
        const btnExportarExcelSaldo = document.getElementById('btnExportarExcelSaldo');
        if (btnExportarExcelSaldo) {
            btnExportarExcelSaldo.addEventListener('click', function() {
                if (typeof exportarExcelSaldoTecnico === 'function') {
                    exportarExcelSaldoTecnico();
                } else {
                    mostrarToast("❌ Función de exportación no disponible.", "error");
                }
            });
            console.log("✅ Botón Exportar Excel Saldo Técnico inicializado");
        }
        
        // =======================================================
        // === 22. CONTROL DE DROPDOWNS ===
        // =======================================================
        let currentDropdown = null;
        
        document.addEventListener('click', function(e) {
            // Si se hace clic fuera de un dropdown, cerrar todos
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(el => {
                    el.classList.remove('show');
                });
                currentDropdown = null;
                return;
            }
            
            const dropdown = e.target.closest('.dropdown');
            if (!dropdown) return;
            
            const btn = dropdown.querySelector('.btn-estado');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (e.target === btn || btn.contains(e.target)) {
                // Cerrar cualquier otro menú abierto
                if (currentDropdown && currentDropdown !== dropdown) {
                    currentDropdown.querySelector('.dropdown-content').classList.remove('show');
                }
                
                // Alternar el menú actual
                content.classList.toggle('show');
                currentDropdown = content.classList.contains('show') ? dropdown : null;
                
                // Evitar que el clic se propague
                e.stopPropagation();
            }
        });
        
        // Cerrar el menú si el mouse sale del botón o del menú
        document.addEventListener('mouseover', function(e) {
            if (currentDropdown) {
                const btn = currentDropdown.querySelector('.btn-estado');
                const content = currentDropdown.querySelector('.dropdown-content');
                
                // Si el mouse está fuera del botón y del menú, cerrarlo
                if (!btn.contains(e.target) && !content.contains(e.target)) {
                    content.classList.remove('show');
                    currentDropdown = null;
                }
            }
        });
        
        // Cerrar menús si se hace scroll
        window.addEventListener('scroll', () => {
            document.querySelectorAll('.dropdown-content').forEach(el => {
                el.classList.remove('show');
            });
            currentDropdown = null;
        });
        
        // =======================================================
        // === 23. ACTUALIZACIÓN FINAL ===
        // =======================================================
        if (typeof actualizarPersonal === 'function') {
            actualizarPersonal();
        }
        
        console.log('✅ Todos los listeners inicializados correctamente');
        

        // === Observer panel devolución (integrado) ===
        const panelDevolucion = document.getElementById('panel-devolucion-equipos');
        if (panelDevolucion) {
            const observer = new MutationObserver(() => {
                if (panelDevolucion.style.display !== 'none') {
                    const tipoDev = document.getElementById('tipo-devolucion');
                    const formNmalos = document.getElementById('form-nmalos');
                    const formReversa = document.getElementById('form-reversa');
                    if (tipoDev) tipoDev.value = '';
                    if (formNmalos) formNmalos.style.display = 'none';
                    if (formReversa) formReversa.style.display = 'none';
                }
            });
            observer.observe(panelDevolucion, { attributes: true, attributeFilter: ['style'] });
        }
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        console.error('Stack trace:', error.stack);
        mostrarToast('Error al inicializar la aplicación. Ver consola.', 'error');
    }
    // === VINCULAR SERVICIO → SUBSERVICIO (para flujo directo) ===
    const servicioSelect = document.getElementById('orden-servicio');
    const subServicioSelect = document.getElementById('orden-sub');

    if (servicioSelect && subServicioSelect) {
        // Cargar servicios al inicio
        if (Object.keys(appData.servicios).length > 0) {
            populateSelect(servicioSelect, 
                Object.keys(appData.servicios).map(s => ({ value: s, text: s })), 
                "Seleccione Servicio"
            );
        }

        // Listener para cargar subservicios al cambiar servicio
        servicioSelect.addEventListener('change', function() {
            cargarSubServicio(subServicioSelect, this);
        });
    }
    setupRutListeners();

    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const menuToggle = document.querySelector('.menu-toggle');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '☰';
        }
    });
    // Navegación Flota/Pañol
    document.querySelectorAll('[data-panel^="panel-flota-"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.panel.replace('panel-flota-', '');
            mostrarPanel(btn.dataset.panel);
            renderFlota(view === 'km' ? 'km' : view === 'prox-revision' ? 'prox' : 'actual');
        });
    });

    document.querySelectorAll('[data-panel^="panel-panol-"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.panel.replace('panel-panol-', '');
            mostrarPanel(btn.dataset.panel);
            renderPañol(cat);
        });
    });

    // Modales simples (puedes reutilizar tu modal genérico o crear uno rápido)
    function abrirModalFlota() {
        // Implementa tu modal aquí o usa prompt para prueba rápida
        const patente = prompt("Patente:");
        if(!patente) return;
        guardarFlota({ patente, marca: 'Toyota', modelo: 'Hilux', km_actual: 45000, km_prox_revision: 50000, estado: 'Activo', ultima_actualizacion: new Date().toLocaleDateString() });
    }

    function abrirModalPañol(cat) {
        const nombre = prompt("Nombre del item:");
        if(!nombre) return;
        guardarPañol(cat, { nombre, codigo: 'GEN-001', stock: 10, ubicacion: 'Estante A', estado: 'Disponible' });
    }

    function cerrarModales() {
        // Cierra tu modal existente
        document.querySelectorAll('.modal, .backdrop').forEach(el => el.style.display = 'none');
    }

});

// =======================================================
// === GENERAR DECOS Y EXTENSORES AL CAMBIAR SUBSERVICIO ===
// =======================================================
document.getElementById('orden-sub')?.addEventListener('change', function() {
    const subservicio = this.value;
    if (!subservicio) return;

    // 1. Extraer cantidades
    const matchDeco = subservicio.match(/(\d+)\s*deco/i);
    const cantDecos = matchDeco ? parseInt(matchDeco[1]) : 0;

    const matchExt = subservicio.match(/(\d+)\s*ext/i);
    const cantExts = matchExt ? parseInt(matchExt[1]) : 0;

    // 2. Opciones base del Modem
    const modemSelect = document.getElementById('ferreteria-modem');
    const opcionesHTML = modemSelect ? modemSelect.innerHTML : '<option value="">-- Seleccione --</option>';

    // 3. Generar DECOS (Sin labels individuales)
    const contenedorDecos = document.getElementById('contenedor-decos-ingreso');
    if (contenedorDecos) {
        contenedorDecos.innerHTML = '';
        for (let i = 1; i <= cantDecos; i++) {
            const select = document.createElement('select');
            select.id = `deco-ingreso-${i}`;
            select.className = 'form-control select-serie';
            select.required = true;
            select.style.cssText = 'width:100%; height:42px; padding:9px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; box-sizing:border-box; background:#fff;';
            select.innerHTML = opcionesHTML;
            
            // Personalizamos el placeholder interno
            if(select.options[0]) select.options[0].text = `-- Seleccione Deco ${i} --`;
            
            contenedorDecos.appendChild(select);
        }
    }

    // 4. Generar EXTENSORES (Sin labels individuales, estilo uniforme)
    const contenedorExts = document.getElementById('contenedor-extensores-ingreso');
    const labelTituloExt = document.getElementById('label-extensores-titulo');
    
    if (contenedorExts) {
        contenedorExts.innerHTML = '';
        if (cantExts > 0) {
            if(labelTituloExt) labelTituloExt.style.display = 'block'; // Mostramos el título principal "Extensores *"
            
            for (let i = 1; i <= cantExts; i++) {
                const select = document.createElement('select');
                select.id = `extensor-ingreso-${i}`;
                select.className = 'form-control select-serie';
                select.required = true;
                select.style.cssText = 'width:100%; height:42px; padding:9px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; box-sizing:border-box; background:#fff;';
                select.innerHTML = opcionesHTML;
                
                // Personalizamos el placeholder interno
                if(select.options[0]) select.options[0].text = `-- Seleccione Extensor ${i} --`;

                contenedorExts.appendChild(select);
            }
        } else {
            if(labelTituloExt) labelTituloExt.style.display = 'none'; // Ocultamos el título si no hay extensores
        }
    }
});

/**
 * Carga las series disponibles del stock del técnico en los selects de ingreso
 */
function cargarStockEnSelectsIngreso() {
    const tecnicoActivo = window.usuarioActivo;
    if (!tecnicoActivo) return;

    const tecnico = appData.empleados.find(emp => 
        `${emp.nombre1} ${emp.apepaterno}`.trim() === tecnicoActivo.nombre
    );
    if (!tecnico?.stock?.equipos?.length) return;

    const opcionesEquipos = tecnico.stock.equipos.map(eq => {
        const articulo = appData.articulos.seriados.find(a => a.codigo === eq.articuloCodigo);
        const nombre = articulo?.nombre || eq.articuloCodigo;
        return { value: eq.serie1, text: `${eq.serie1} (${nombre})` };
    });

    // Llenar select de Modem
    const modemSelect = document.getElementById('ferreteria-modem');
    if (modemSelect) {
        modemSelect.innerHTML = '<option value="">-- Seleccione Modem --</option>';
        opcionesEquipos.forEach(op => {
            const opt = document.createElement('option');
            opt.value = op.value;
            opt.textContent = op.text;
            modemSelect.appendChild(opt);
        });
    }

    // Llenar selects de Decos dinámicos
    document.querySelectorAll('#contenedor-decos-ingreso .select-serie').forEach(select => {
        select.innerHTML = '<option value="">-- Seleccione Serie --</option>';
        opcionesEquipos.forEach(op => {
            const opt = document.createElement('option');
            opt.value = op.value;
            opt.textContent = op.text;
            select.appendChild(opt);
        });
    });

    // Llenar selects de Extensores dinámicos
    document.querySelectorAll('#contenedor-extensores-ingreso .select-serie').forEach(select => {
        select.innerHTML = '<option value="">-- Seleccione Serie --</option>';
        opcionesEquipos.forEach(op => {
            const opt = document.createElement('option');
            opt.value = op.value;
            opt.textContent = op.text;
            select.appendChild(opt);
        });
    });
}

// ══════════════════════════════════════════════════════
// PUNTO 1: Limpiar decos que están en órdenes liquidadas pero siguen en stock
// ══════════════════════════════════════════════════════
window.limpiarStockConsumidoEnOrdenes = async function() {
    console.log('🔍 Buscando series instaladas en órdenes que siguen en stock de técnicos...');

    // Recopilar todas las series instaladas en órdenes liquidadas
    const seriesInstaladas = new Set();
    const seriesTarjetasInstaladas = new Set();
    const seriesLNBInstaladas = new Set();

    ordenes.forEach(o => {
        if (o.estado === 'Liquidadas') {
            (o.series_entrada || []).forEach(s => seriesInstaladas.add(s));
            (o.series_tarjetas || []).forEach(s => seriesTarjetasInstaladas.add(s));
            (o.series_lnb || []).forEach(s => seriesLNBInstaladas.add(s));
        }
    });

    console.log(`📊 Series instaladas en órdenes: ${seriesInstaladas.size} equipos, ${seriesTarjetasInstaladas.size} tarjetas, ${seriesLNBInstaladas.size} LNBs`);

    let totalLimpiados = 0;
    let detalles = [];

    // Revisar cada técnico
    for (const emp of appData.empleados) {
        if (!emp.stock) continue;

        // Equipos duplicados
        const equiposDuplicados = (emp.stock.equipos || []).filter(e => seriesInstaladas.has(e.serie1));
        const tarjetasDuplicadas = (emp.stock.tarjetas || []).filter(t => seriesTarjetasInstaladas.has(t.serie));
        const lnbsDuplicados = (emp.stock.lnbs || []).filter(l => seriesLNBInstaladas.has(l.serie));

        if (!equiposDuplicados.length && !tarjetasDuplicadas.length && !lnbsDuplicados.length) continue;

        const nombre = `${emp.nombre1} ${emp.apepaterno}`;
        detalles.push({
            tecnico: nombre,
            equipos: equiposDuplicados.map(e => e.serie1),
            tarjetas: tarjetasDuplicadas.map(t => t.serie),
            lnbs: lnbsDuplicados.map(l => l.serie)
        });

        console.log(`⚠️ ${nombre}: ${equiposDuplicados.length} equipos, ${tarjetasDuplicadas.length} tarjetas, ${lnbsDuplicados.length} LNBs consumidos pero en stock`);
        totalLimpiados += equiposDuplicados.length + tarjetasDuplicadas.length + lnbsDuplicados.length;
    }

    if (totalLimpiados === 0) {
        console.log('✅ No hay series duplicadas — el stock está limpio');
        return;
    }

    console.log(`\n📋 RESUMEN: ${totalLimpiados} series a limpiar en ${detalles.length} técnicos`);
    console.table(detalles.map(d => ({
        Técnico: d.tecnico,
        Equipos: d.equipos.join(', ') || '—',
        Tarjetas: d.tarjetas.join(', ') || '—',
        LNBs: d.lnbs.join(', ') || '—'
    })));

    if (!confirm(`⚠️ Se encontraron ${totalLimpiados} series instaladas en órdenes pero que siguen en stock.\n\n¿Desea eliminarlas del stock de los técnicos?\n\nEsto NO se puede deshacer.`)) {
        console.log('❌ Operación cancelada por el usuario');
        return;
    }

    // Ejecutar limpieza en Supabase
    console.log('🧹 Ejecutando limpieza...');
    let errores = 0;

    for (const emp of appData.empleados) {
        if (!emp.stock) continue;

        const equiposDup = (emp.stock.equipos || []).filter(e => seriesInstaladas.has(e.serie1));
        const tarjetasDup = (emp.stock.tarjetas || []).filter(t => seriesTarjetasInstaladas.has(t.serie));
        const lnbsDup = (emp.stock.lnbs || []).filter(l => seriesLNBInstaladas.has(l.serie));

        if (!equiposDup.length && !tarjetasDup.length && !lnbsDup.length) continue;

        // Limpiar en Supabase
        const { data: asignaciones } = await supabase
            .from('asignaciones')
            .select('*')
            .eq('tecnico_id', emp.id);

        for (const asig of (asignaciones || [])) {
            let nuevasSeries;
            if (asig.tipo === 'equipo') {
                const seriesDup = new Set(equiposDup.map(e => e.serie1));
                nuevasSeries = asig.series.filter(s => {
                    const s1 = typeof s === 'object' ? s.serie1 : s;
                    return !seriesDup.has(s1);
                });
            } else if (asig.tipo === 'tarjeta') {
                const seriesDup = new Set(tarjetasDup.map(t => t.serie));
                nuevasSeries = asig.series.filter(s => {
                    const sv = typeof s === 'object' ? s.serie : s;
                    return !seriesDup.has(sv);
                });
            } else if (asig.tipo === 'lnb') {
                const seriesDup = new Set(lnbsDup.map(l => l.serie));
                nuevasSeries = asig.series.filter(s => {
                    const sv = typeof s === 'object' ? s.serie : s;
                    return !seriesDup.has(sv);
                });
            } else {
                continue;
            }

            if (nuevasSeries.length === 0) {
                await supabase.from('asignaciones').delete().eq('id', asig.id);
            } else {
                await supabase.from('asignaciones').update({ series: nuevasSeries }).eq('id', asig.id);
            }
        }

        // Actualizar memoria local
        emp.stock.equipos = (emp.stock.equipos || []).filter(e => !seriesInstaladas.has(e.serie1));
        emp.stock.tarjetas = (emp.stock.tarjetas || []).filter(t => !seriesTarjetasInstaladas.has(t.serie));
        emp.stock.lnbs = (emp.stock.lnbs || []).filter(l => !seriesLNBInstaladas.has(l.serie));

        console.log(`✅ ${emp.nombre1} ${emp.apepaterno} limpiado`);
    }

    console.log(`\n✅ LIMPIEZA COMPLETA: ${totalLimpiados} series eliminadas del stock.`);
    mostrarToast(`✅ Stock limpiado: ${totalLimpiados} series consumidas eliminadas`, 'success');
};
// ─── TRANSFERENCIA: Seleccionar todos los checkboxes ────────
window.seleccionarTodosTransferencia = function() {
    const checks = document.querySelectorAll('#lista-materiales-origen .chk-transferir');
    const todosChecked = Array.from(checks).every(c => c.checked);
    checks.forEach(c => { c.checked = !todosChecked; });
    actualizarResumenTransferencia();
};

function actualizarResumenTransferencia() {
    const checks = document.querySelectorAll('#lista-materiales-origen .chk-transferir:checked');
    const resumen = document.getElementById('resumen-transferencia');
    const contenedorDestino = document.getElementById('contenedor-destino');
    const btnTransferir = document.getElementById('btn-transferir');

    const guiaContenedor = document.getElementById('contenedor-guia-transferencia');
    if (checks.length > 0) {
        contenedorDestino.style.display = 'block';
        resumen.style.display = 'block';
        if (guiaContenedor) guiaContenedor.style.display = 'block';
        resumen.innerHTML = `
            <div style="background:#e8f5e9; border:1px solid #28a745; border-radius:8px; padding:15px;">
                <strong style="color:#28a745;">✅ ${checks.length} item(s) seleccionado(s)</strong>
                <ul style="margin:10px 0 0; padding-left:20px; font-size:13px; color:#333;">
                    ${Array.from(checks).map(c => `<li>${c.dataset.nombre || c.dataset.serie1 || c.dataset.serie}</li>`).join('')}
                </ul>
            </div>`;
        btnTransferir.style.display = 'inline-block';
    } else {
        contenedorDestino.style.display = 'none';
        resumen.style.display = 'none';
        btnTransferir.style.display = 'none';
        if (guiaContenedor) guiaContenedor.style.display = 'none';
    }
}

async function transferirMateriales() {
    const origenId = document.getElementById('tec-origen').value;
    const destinoId = document.getElementById('tec-destino').value;

    if (!origenId || !destinoId) {
        return mostrarToast("Seleccione técnico origen y destino.", "error");
    }
    if (origenId === destinoId) {
        return mostrarToast("El técnico origen y destino no pueden ser el mismo.", "error");
    }

    const guiaTransferencia = document.getElementById('guia-transferencia')?.value.trim();
    if (!guiaTransferencia) {
        return mostrarToast("⚠️ Debe ingresar un número de guía para la transferencia.", "error");
    }

    const checkboxes = document.querySelectorAll('#lista-materiales-origen .chk-transferir:checked');
    if (checkboxes.length === 0) {
        return mostrarToast("Seleccione al menos un material para transferir.", "error");
    }

    try {
        // Agrupar por código de artículo
        const grupos = {};
        checkboxes.forEach(cb => {
            const cod = cb.dataset.codigo;
            if (!grupos[cod]) {
                grupos[cod] = {
                    tipo: cb.dataset.tipo,
                    series: [],
                    guia: cb.dataset.guia || ''
                };
            }
            // Usar serie1 para equipos, serie normal para tarjetas/LNB
            const serie = cb.dataset.tipo === 'equipo' ? cb.dataset.serie1 : cb.dataset.serie;
            grupos[cod].series.push(serie);
        });

        // Si el destino es "bodega", hacemos devolución
        if (destinoId === 'bodega') {
            for (const [codigo, info] of Object.entries(grupos)) {
                const tipo = info.tipo;
                const seriesAMover = info.series;

                // 1. Eliminar del técnico origen
                const { error: errOrigen } = await supabase
                    .from('asignaciones')
                    .delete()
                    .eq('tecnico_id', origenId)
                    .eq('articulo_codigo', codigo)
                    .eq('tipo', tipo === 'equipo' ? 'equipo' : tipo);

                if (errOrigen) {
                    console.error("Error al eliminar asignación:", errOrigen);
                    throw new Error(`Error al devolver ${tipo} a bodega.`);
                }

                // 2. Actualizar stock local del técnico
                const tecnico = appData.empleados.find(e => e.id === origenId);
                if (tecnico && tecnico.stock) {
                    if (tipo === 'equipo') {
                        tecnico.stock.equipos = tecnico.stock.equipos.filter(eq =>
                            !(eq.articuloCodigo === codigo && seriesAMover.includes(eq.serie1))
                        );
                    } else if (tipo === 'tarjeta') {
                        tecnico.stock.tarjetas = tecnico.stock.tarjetas.filter(t =>
                            !(t.articuloCodigo === codigo && seriesAMover.includes(t.serie))
                        );
                    } else if (tipo === 'lnb') {
                        tecnico.stock.lnbs = tecnico.stock.lnbs.filter(l =>
                            !(l.articuloCodigo === codigo && seriesAMover.includes(l.serie))
                        );
                    }
                }

                // 3. Registrar en historial de transferencias
                await supabase
                .from('transferencias')
                .insert([{
                    origen_id: origenId,
                    destino_id: null,
                    items: [{ codigo, cantidad: seriesAMover.length }],
                    fecha_transferencia: new Date().toISOString(),
                    usuario: window.usuarioActivo?.nombre || 'Admin',
                    tipo: 'devolucion_a_bodega'
                }]);
            }

            mostrarToast("✅ Materiales devueltos a bodega con éxito.", "success");
        } 
        // Si el destino es otro técnico → transferencia normal
        else {
            for (const [codigo, info] of Object.entries(grupos)) {
                const tipo = info.tipo;
                const seriesAMover = info.series;

                // --- PASO A: Quitar del origen (todas las asignaciones del técnico para ese artículo) ---
                const { data: asigOrigen, error: errO } = await supabase
                    .from('asignaciones')
                    .select('*')
                    .eq('tecnico_id', origenId)
                    .eq('articulo_codigo', codigo)
                    .eq('tipo', tipo === 'equipo' ? 'equipo' : tipo);

                for (const asigO of (asigOrigen || [])) {
                    const nuevasSeriesO = asigO.series.filter(s => {
                        const sVal = tipo === 'equipo' 
                            ? (typeof s === 'object' ? s.serie1 : s)
                            : (typeof s === 'object' ? s.serie : s);
                        return !seriesAMover.includes(sVal);
                    });
                    if (nuevasSeriesO.length === 0) {
                        await supabase.from('asignaciones').delete().eq('id', asigO.id);
                    } else {
                        await supabase.from('asignaciones').update({ series: nuevasSeriesO }).eq('id', asigO.id);
                    }
                }

                // --- PASO B: Agregar al destino ---
                const { data: asigD, error: errD } = await supabase
                    .from('asignaciones')
                    .select('*')
                    .eq('tecnico_id', destinoId)
                    .eq('articulo_codigo', codigo)
                    .eq('tipo', tipo === 'equipo' ? 'equipo' : tipo)
                    .maybeSingle();

                const nuevasSeriesParaDestino = seriesAMover.map(s => 
                    tipo === 'equipo' 
                        ? { serie1: s, serie2: '', articulo_codigo: codigo }
                        : { serie: s, articulo_codigo: codigo }
                );

                if (asigD) {
                    const seriesFinalesD = [...asigD.series, ...nuevasSeriesParaDestino];
                    await supabase.from('asignaciones').update({ series: seriesFinalesD }).eq('id', asigD.id);
                } else {
                    await supabase.from('asignaciones').insert({
                        tecnico_id: destinoId,
                        articulo_codigo: codigo,
                        tipo: tipo === 'equipo' ? 'equipo' : tipo,
                        series: nuevasSeriesParaDestino,
                        fecha: new Date().toISOString().split('T')[0],
                        guia_salida: guiaTransferencia
                    });
                }

                // --- PASO C: Actualizar stock local ---
                const origen = appData.empleados.find(e => e.id === origenId);
                const destino = appData.empleados.find(e => e.id === destinoId);
                if (origen?.stock && destino?.stock) {
                    if (tipo === 'equipo') {
                        origen.stock.equipos = origen.stock.equipos.filter(eq =>
                            !(eq.articuloCodigo === codigo && seriesAMover.includes(eq.serie1))
                        );
                        seriesAMover.forEach(s => {
                            destino.stock.equipos.push({
                                articuloCodigo: codigo,
                                serie1: s,
                                serie2: '',
                                fechaAsignacion: new Date().toISOString().split('T')[0]
                            });
                        });
                    } else if (tipo === 'tarjeta') {
                        origen.stock.tarjetas = origen.stock.tarjetas.filter(t =>
                            !(t.articuloCodigo === codigo && seriesAMover.includes(t.serie))
                        );
                        seriesAMover.forEach(s => {
                            destino.stock.tarjetas.push({
                                articuloCodigo: codigo,
                                serie: s,
                                fechaAsignacion: new Date().toISOString().split('T')[0]
                            });
                        });
                    } else if (tipo === 'lnb') {
                        origen.stock.lnbs = origen.stock.lnbs.filter(l =>
                            !(l.articuloCodigo === codigo && seriesAMover.includes(l.serie))
                        );
                        seriesAMover.forEach(s => {
                            destino.stock.lnbs.push({
                                articuloCodigo: codigo,
                                serie: s,
                                fechaAsignacion: new Date().toISOString().split('T')[0]
                            });
                        });
                    }
                }

                // --- PASO D: Historial ---
                const { data, error } = await supabase
        .from('transferencias')
        .insert([{
            origen_id: origenId,
            destino_id: destinoId,
            items: [{ codigo, cantidad: seriesAMover.length }],
            fecha_transferencia: new Date().toISOString(),
            usuario: window.usuarioActivo?.nombre || 'Admin',
            tipo: 'transferencia_tecnico'
        }])
        .select();

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {
            console.error("Mensaje:", error.message);
            console.error("Detalle:", error.details);
            console.error("Hint:", error.hint);
            alert("Error revisa consola");
            return;
        }
            }
            await registrarBitacora(
                'transferencia',
                `Transferencia de ${checkboxes.length} ítem(s)`,
                `Origen: ${origenId} | Destino: ${destinoId} | Guía: ${guiaTransferencia}`
            );

            mostrarToast("✅ Transferencia completada con éxito.", "success");
        }

        // Limpiar formulario
        document.getElementById('tec-origen').value = '';
        document.getElementById('tec-destino').value = '';
        document.getElementById('stock-origen').style.display = 'none';
        document.getElementById('contenedor-destino').style.display = 'none';
        document.getElementById('btn-transferir').style.display = 'none';
        document.getElementById('lista-materiales-origen').innerHTML = '';
        const guiaEl = document.getElementById('guia-transferencia');
        if (guiaEl) guiaEl.value = '';
        const guiaCont = document.getElementById('contenedor-guia-transferencia');
        if (guiaCont) guiaCont.style.display = 'none';

    } catch (err) {
        console.error("Error en transferencia:", err);
        mostrarToast("❌ Error crítico en la transferencia.", "error");
    }
}
    
// =======================================================
// --- PROCESAR ASIGNACIÓN FINAL (ACUMULADA) ---
// =======================================================
async function procesarAsignacionFinal() {
    if (!asignacionActiva.tecnicoId) return mostrarToast("Seleccione un técnico.", "error");
    
    const tecnico = appData.empleados.find(e => e.id === asignacionActiva.tecnicoId);
    if (!tecnico) return mostrarToast("Técnico no válido.", "error");
    
    const materialCodigo = asignacionActiva.materialCodigo;
    const tipo = asignacionActiva.tipo;
    // Extraer solo las series válidas (sin errores)
    const hayErrores = asignacionActiva.seriesIngresadas.some(s => s._error);
    if (hayErrores) {
        return mostrarToast('❌ Hay series con error — corrígelas antes de asignar.', 'error');
    }
    const seriesIngresadas = asignacionActiva.seriesIngresadas
        .map(s => typeof s === 'object' ? s.valor : s)
        .map(s => s.trim())
        .filter(s => s);
    
    if (seriesIngresadas.length === 0) return mostrarToast("No hay series para asignar.", "error");
    
    try {
        let seriesParaBD = [];
        if (tipo === 'equipo') {
            seriesParaBD = seriesIngresadas.map(s => ({
                serie1: normalizarSerie(s),
                serie2: ''
            }));
        } else {
            seriesParaBD = seriesIngresadas.map(s => ({
                serie: normalizarSerie(s)
            }));
        }
        
        // ✅ GENERAR GUÍA SOLO SI ES LA PRIMERA ASIGNACIÓN DE LA SESIÓN
        if (!sesionActiva) {
            guiaActual = generarGuiaAsignacion();
            sesionActiva = true;
            asignacionesPendientes = [];
            console.log('🆕 Nueva sesión de asignación iniciada. Guía:', guiaActual);
        }
        
        // ✅ GUARDAR EN SUPABASE INMEDIATAMENTE (pero acumular para guía)
        await supabase.from('asignaciones').insert({
            tipo,
            articulo_codigo: materialCodigo,
            series: seriesParaBD,
            tecnico_id: tecnico.id,
            fecha: new Date().toISOString().split('T')[0],
            guia_salida: guiaActual
        });
        
        // ✅ ACUMULAR PARA LA GUÍA FINAL
        const articulo = tipo === 'equipo' ?
            appData.articulos.seriados.find(a => a.codigo === materialCodigo) :
            appData.articulos.ferreteria.find(a => a.codigo === materialCodigo);
        
        asignacionesPendientes.push({
            tecnico,
            tipo,
            materialCodigo,
            nombreArticulo: articulo?.nombre || materialCodigo,
            seriesParaBD,
            cantidad: seriesParaBD.length
        });
        
        await cargarDatos();
        
        mostrarToast(`✅ Material asignado. Guía: ${guiaActual}`, "success");

        await registrarBitacora(
            'asignacion',
            `Material asignado a ${tecnico.nombre1} ${tecnico.apepaterno}`,
            `Guía: ${guiaActual} | Tipo: ${tipo} | Artículo: ${materialCodigo} | Cantidad: ${seriesIngresadas.length}`
        );
        
        // ✅ ESTO ES LO IMPORTANTE: MOSTRAR EL MODAL
        mostrarModalMasMateriales();  // ← ¡DEBE ESTAR AQUÍ!
        
    } catch (err) {
        console.error("Error al asignar:", err);
        mostrarToast("Error al guardar asignación en la nube.", "error");
    }
}

// =======================================================
// --- MODAL: ¿DESEA AGREGAR MÁS MATERIALES? ---
// =======================================================
function mostrarModalMasMateriales() {
    console.log('📦 Mostrando modal de más materiales...');  // ← AGREGA ESTE LOG
    
    const modalExistente = document.getElementById('modal-mas-materiales');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.id = 'modal-mas-materiales';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 3000;
        display: flex; justify-content: center; align-items: center;`;
    
    modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 450px; width: 90%; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <h3 style="margin-top: 0; color: #007bff; font-size: 1.5em;">📦 ¿Desea agregar más materiales?</h3>
        <p style="color: #666; margin: 20px 0;">
            ¿Desea agregar mas equipos?.<br>
            Todo se incluira en la misma guía (<strong>${guiaActual}</strong>).
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
            <button id="btn-si-mas-materiales" style="background: #28a745; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                ✅ Sí, agregar más
            </button>
            <button id="btn-no-finalizar" style="background: #007bff; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                📄 No, finalizar y imprimir guía
            </button>
        </div>
    </div>
    `;
    
    document.body.appendChild(modal);
    
    // ✅ BOTÓN: SÍ, AGREGAR MÁS
    document.getElementById('btn-si-mas-materiales').onclick = () => {
        console.log('➕ Usuario quiere agregar más materiales');  // ← LOG
        modal.remove();
        resetMaterialAsignacion();
        mostrarPanel('panel-asignacion-materiales');
        mostrarToast("➕ Continúe asignando materiales", "info");
    };
    
    // ✅ BOTÓN: NO, FINALIZAR
    document.getElementById('btn-no-finalizar').onclick = () => {
        console.log('📄 Usuario quiere finalizar');  // ← LOG
        modal.remove();
        finalizarSesionAsignacion();
    };
}

// =======================================================
// --- FINALIZAR SESIÓN DE ASIGNACIÓN ---
// =======================================================
async function finalizarSesionAsignacion() {
    console.log('🔄 Finalizando sesión de asignación...');
    
    if (asignacionesPendientes.length === 0) {
        mostrarToast("⚠️ No hay asignaciones pendientes.", "warning");
        return;
    }
    
    mostrarLoader('Finalizando asignación y generando documentos...');
    
    try {
        const tecnico = asignacionesPendientes[0].tecnico;
        
        // ✅ 1. Generar cuerpo del correo con TODOS los materiales
        let cuerpo = `Hola ${tecnico.nombre1},\n\n`;
        cuerpo += `Se han asignado los siguientes materiales bajo la Guía: ${guiaActual}\n\n`;
        
        asignacionesPendientes.forEach((item, idx) => {
            cuerpo += `${idx + 1}. ${item.nombreArticulo} (${item.tipo.toUpperCase()})\n`;
            item.seriesParaBD.forEach(s => {
                cuerpo += `   - ${s.serie1 || s.serie}\n`;
            });
            cuerpo += '\n';
        });
        cuerpo += `\nSaludos,\nSistema de Gestión Logística`;
        
        const asunto = `Asignación de Materiales - Guía ${guiaActual}`;
        
        // ✅ 2. Enviar correo al técnico
        if (tecnico.email) {
            try {
                await emailjs.send('service_8p2y4a6', 'template_m8313jl', {
                    to_email: tecnico.email,
                    to_name: tecnico.nombre1,
                    subject: asunto,
                    message: cuerpo
                });
                console.log("✅ Correo enviado al técnico:", tecnico.email);
            } catch (err) {
                console.error("❌ Error al enviar al técnico:", err);
            }
        }
        
        // ✅ 3. Enviar copia a bodega
        try {
            await emailjs.send('service_8p2y4a6', 'template_m8313jl', {
                to_email: "bodegapoolosorno@gmail.com",
                to_name: "Bodega Pool",
                subject: "[COPIA BODEGA] " + asunto,
                message: cuerpo + "\n\n--- COPIA DE RESPALDO PARA BODEGA ---"
            });
            console.log("✅ Copia enviada a bodega");
        } catch (err) {
            console.error("❌ Error al enviar a bodega:", err);
        }
        
        // ✅ 4. GENERAR E IMPRIMIR GUÍA FÍSICA 👈 ESTO FALTABA
        generarGuiaImprimibleAsignacion(asignacionesPendientes, guiaActual, tecnico);
        
        // ✅ 5. Mostrar toast de éxito
        mostrarToast(`✅ Asignación completada. Guía: ${guiaActual}`, "success");
        
        // ✅ 6. Limpiar sesión
        asignacionesPendientes = [];
        guiaActual = null;
        sesionActiva = false;
        
        resetAsignacionCompleta();
        mostrarPanel('modulo-bienvenida');
        
    } catch (err) {
        console.error("❌ Error al finalizar asignación:", err);
        mostrarToast("❌ Error al finalizar. Ver consola.", "error");
    } finally {
        ocultarLoader();
    }
}

// =======================================================
// --- GENERAR GUÍA IMPRIMIBLE PARA ASIGNACIONES ---
// =======================================================
function generarGuiaImprimibleAsignacion(asignaciones, guia, tecnico) {
    const anterior = document.getElementById('modal-guia-asignacion');
    if (anterior) anterior.remove();

    const fechaActual = new Date().toLocaleDateString('es-CL', {
    timeZone: 'America/Santiago',
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const horaActual = new Date().toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
        hour: '2-digit', minute: '2-digit'
    });
    const usuario = window.usuarioActivo?.nombre || 'Sistema';

    let totalSeries = 0;
    asignaciones.forEach(item => totalSeries += item.seriesParaBD.length);

    let filas = '';
    let contador = 1;
    asignaciones.forEach(item => {
        item.seriesParaBD.forEach(s => {
            const serie = s.serie1 || s.serie || '—';
            filas += `
            <tr>
                <td class="gp-td gp-center">${contador++}</td>
                <td class="gp-td">${item.nombreArticulo}</td>
                <td class="gp-td gp-center">${item.tipo.toUpperCase()}</td>
                <td class="gp-td gp-mono">${serie}</td>
            </tr>`;
        });
    });

    const modal = document.createElement('div');
    modal.id = 'modal-guia-asignacion';
    modal.innerHTML = `
    <style>
        #modal-guia-asignacion {
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(0,0,0,0.45);
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .gp-wrap {
            background: #fff;
            width: 100%; max-width: 680px;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid #ccc;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        .gp-header {
            padding: 28px 36px 20px;
            border-bottom: 2px solid #222;
        }
        .gp-empresa {
            font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
            color: #888; margin-bottom: 6px;
        }
        .gp-title {
            font-size: 20px; font-weight: bold; color: #111; margin: 0 0 14px;
        }
        .gp-header-info {
            display: grid; grid-template-columns: 1fr 1fr 1fr;
            gap: 12px; font-size: 12px;
        }
        .gp-info-item label {
            display: block; color: #888; margin-bottom: 2px; font-size: 10px;
            text-transform: uppercase; letter-spacing: 1px;
        }
        .gp-info-item span { font-weight: 600; color: #111; }
        .gp-guia-highlight {
            font-size: 15px; font-family: 'Courier New', monospace;
            font-weight: bold; color: #111;
        }
        .gp-body { padding: 24px 36px 30px; }
        .gp-section-title {
            font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
            color: #888; margin-bottom: 12px;
        }
        .gp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .gp-table thead th {
            border-top: 2px solid #333;
            border-bottom: 1px solid #333;
            padding: 8px 10px;
            font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
            color: #333; font-weight: bold; text-align: left;
            background: #fff;
        }
        .gp-table thead th:first-child,
        .gp-table thead th:nth-child(3) { text-align: center; }
        .gp-td { padding: 9px 10px; border-bottom: 1px solid #eee; color: #222; }
        .gp-center { text-align: center; color: #555; }
        .gp-mono {
            font-family: 'Courier New', monospace;
            font-size: 12px; font-weight: bold; letter-spacing: 0.5px;
        }
        .gp-total-row {
            text-align: right; margin-top: 10px;
            font-size: 12px; color: #333;
            border-top: 1px solid #222; padding-top: 8px;
        }
        .gp-firmas {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 50px; margin-top: 50px;
        }
        .gp-firma-box { text-align: center; }
        .gp-firma-line {
            border-top: 1px solid #333; padding-top: 8px; margin-top: 50px;
        }
        .gp-firma-nombre { font-size: 12px; font-weight: bold; color: #111; }
        .gp-firma-sub { font-size: 11px; color: #888; margin-top: 3px; }
        .gp-footer-doc {
            margin-top: 24px; padding-top: 14px;
            border-top: 1px dashed #ccc;
            font-size: 10px; color: #bbb;
            text-align: center; letter-spacing: 1px;
        }
        .gp-actions {
            padding: 14px 36px;
            border-top: 1px solid #ddd;
            background: #f7f7f7;
            display: flex; gap: 10px; justify-content: flex-end;
        }
        .gp-btn {
            padding: 9px 22px; font-size: 13px; border: 1px solid #ccc;
            background: #fff; color: #333; cursor: pointer; border-radius: 2px;
            font-family: Arial, sans-serif; transition: background 0.15s;
        }
        .gp-btn:hover { background: #f0f0f0; }
        .gp-btn-print {
            background: #fff; color: #111;
            border-color: #333; font-weight: bold;
        }
        .gp-btn-print:hover { background: #f0f0f0; }

        @media print {
            #modal-guia-asignacion {
                position: static; background: none; padding: 0;
            }
            .gp-wrap {
                box-shadow: none; border: none; max-height: none;
            }
            .gp-actions { display: none !important; }
        }
    </style>

    <div class="gp-wrap">
        <div class="gp-header">
            <div class="gp-empresa">Sistema de Gestión Logística · ARM</div>
            <h2 class="gp-title">Guía de Asignación de Materiales</h2>
            <div class="gp-header-info">
                <div class="gp-info-item">
                    <label>N° Guía</label>
                    <span class="gp-guia-highlight">${guia}</span>
                </div>
                <div class="gp-info-item">
                    <label>Técnico</label>
                    <span>${tecnico.nombre1} ${tecnico.apepaterno}</span>
                </div>
                <div class="gp-info-item">
                    <label>RUT</label>
                    <span>${tecnico.rut}</span>
                </div>
                <div class="gp-info-item">
                    <label>Fecha</label>
                    <span>${fechaActual}</span>
                </div>
                <div class="gp-info-item">
                    <label>Hora</label>
                    <span>${horaActual}</span>
                </div>
                <div class="gp-info-item">
                    <label>Emitido por</label>
                    <span>${usuario}</span>
                </div>
            </div>
        </div>

        <div class="gp-body">
            <div class="gp-section-title">Detalle de materiales entregados</div>
            <table class="gp-table">
                <thead>
                    <tr>
                        <th style="width:40px;">#</th>
                        <th>Artículo</th>
                        <th style="width:80px;">Tipo</th>
                        <th>N° Serie</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
            <div class="gp-total-row">
                Total: <strong>${totalSeries} ítem${totalSeries !== 1 ? 's' : ''}</strong>
            </div>

            <div class="gp-firmas">
                <div class="gp-firma-box">
                    <div class="gp-firma-line">
                        <div class="gp-firma-nombre">${tecnico.nombre1} ${tecnico.apepaterno}</div>
                        <div class="gp-firma-sub">Firma Técnico · RUT ${tecnico.rut}</div>
                    </div>
                </div>
                <div class="gp-firma-box">
                    <div class="gp-firma-line">
                        <div class="gp-firma-nombre">Encargado de Bodega</div>
                        <div class="gp-firma-sub">Firma y Timbre</div>
                    </div>
                </div>
            </div>

            <div class="gp-footer-doc">
                DOCUMENTO INTERNO · GUÍA ${guia} · ${new Date().getFullYear()}
            </div>
        </div>

        <div class="gp-actions">
            <button class="gp-btn" onclick="document.getElementById('modal-guia-asignacion').remove()">
                Cerrar
            </button>
            <button class="gp-btn gp-btn-print" onclick="imprimirGuiaAsignacion()">
                🖨️ Imprimir
            </button>
        </div>
    </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function resetMaterialAsignacion() {
    asignacionActiva.tipo = null;
    asignacionActiva.materialCodigo = null;
    asignacionActiva.cantidad = 0;
    asignacionActiva.seriesIngresadas = [];
    document.getElementById('cantidad-asignar').value = '';
    document.getElementById('input-serie').value = '';
    document.getElementById('lista-series-ingresadas').innerHTML = '';
    document.getElementById('contenedor-cantidad').style.display = 'none';
    document.getElementById('contenedor-ingreso-series').style.display = 'none';
    document.getElementById('contenedor-asignar-final').style.display = 'none';
}
function resetAsignacionCompleta() {
    asignacionActiva = {
        tipo: null,
        materialCodigo: null,
        cantidad: 0,
        seriesIngresadas: [],
        tecnicoNombre: null,
        tecnicoId: null
    };
    document.getElementById('tecnico-asignacion').selectedIndex = 0;
    document.getElementById('tipo-asignacion').value = '';
    document.getElementById('material-asignacion').innerHTML = '<option value="">-- Seleccione --</option>';
    resetMaterialAsignacion();
}

function cargarTecnicosTransferencia() {
    const selectOrigen = document.getElementById('tec-origen');
    const selectDestino = document.getElementById('tec-destino');
    if (!selectOrigen || !selectDestino) return;

    // Solo técnicos activos (cargoId === 'cargo-tecnico')
    const tecnicos = appData.empleados
        .filter(emp => (emp.activo === true || emp.activo === 1) && emp.cargoId === 'cargo-tecnico')
        .sort((a, b) => `${a.nombre1} ${a.apepaterno}`.localeCompare(`${b.nombre1} ${b.apepaterno}`))
        .map(emp => ({
            value: emp.id,
            text: `${emp.nombre1} ${emp.apepaterno}`.trim()
        }));

    populateSelect(selectOrigen, tecnicos, 'Seleccione técnico origen');

    const opcionesDestino = [
        { value: 'bodega', text: '🏭 Devolver a Bodega' },
        ...tecnicos
    ];
    populateSelect(selectDestino, opcionesDestino, 'Seleccione técnico destino');
}

function cargarTecnicosAsignacion() {
    const select = document.getElementById('tecnico-asignacion');
    if (!select) return;

    const tecnicosActivos = appData.empleados
        .filter(emp => 
            emp.activo && 
            appData.cargos.some(c => c.id === emp.cargoId && esCargoTecnico(c.nombre))
        )
        .map(emp => ({
            value: emp.id,
            text: `${emp.nombre1} ${emp.apepaterno}`
        }));

    populateSelect(select, tecnicosActivos, "Seleccione Técnico");
    // Listeners para Gestión de Órdenes
    document.getElementById('btn-eliminar-orden')?.addEventListener('click', () => {
        const numero = document.getElementById('eliminar-orden-numero')?.value.trim();
        if (!numero) return mostrarToast("Ingrese un número de orden.", "error");
        if (eliminarOrdenPorNumero(numero)) {
            document.getElementById('eliminar-orden-numero').value = '';
        }
    });

    document.getElementById('btn-reversar-orden')?.addEventListener('click', () => {
        const numero = document.getElementById('reversar-orden-numero')?.value.trim();
        if (!numero) return mostrarToast("Ingrese un número de orden.", "error");
        if (reversarOrdenPorNumero(numero)) {
            document.getElementById('reversar-orden-numero').value = '';
        }
    });
}

function imprimirGuiaAsignacion() {
    const modal = document.getElementById('modal-guia-asignacion');
    if (!modal) return;
 
    // Toma solo el contenido interno (.gp-wrap), sin el fondo oscuro
    const contenido = modal.querySelector('.gp-wrap')?.innerHTML;
    if (!contenido) return;
 
    // Toma los estilos del modal
    const estilos = modal.querySelector('style')?.innerHTML || '';
 
    // Abre ventana nueva solo con la guía
    const ventana = window.open('', '_blank', 'width=800,height=700');
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Guía de Asignación</title>
            <style>
                ${estilos}
                /* Overrides para impresión limpia */
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background: #fff;
                }
                .gp-wrap {
                    max-width: 100% !important;
                    max-height: none !important;
                    box-shadow: none !important;
                    border: none !important;
                    overflow: visible !important;
                }
                .gp-actions { display: none !important; }
                @media print {
                    body { margin: 0; }
                    .gp-actions { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div class="gp-wrap">${contenido}</div>
            <script>
                // Imprime automáticamente al cargar
                window.onload = function() {
                    // Elimina los botones de acción si quedaron
                    const actions = document.querySelector('.gp-actions');
                    if (actions) actions.remove();
                    setTimeout(() => {
                        window.print();
                        // Cierra la ventana después de imprimir
                        window.onafterprint = () => window.close();
                    }, 300);
                };
            </script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// ================================
// INICIALIZAR ASIGNACIÓN (al mostrar el panel)
// ================================
function inicializarAsignacion() {
    resetAsignacionCompleta();
    cargarTecnicosAsignacion();
    document.getElementById('tecnico-asignacion').addEventListener('change', function() {
    const tecnicoId = this.value;
    asignacionActiva.tecnicoId = tecnicoId;
    const emp = appData.empleados.find(e => e.id === tecnicoId);
    asignacionActiva.tecnicoNombre = emp ? `${emp.nombre1} ${emp.apepaterno}` : null;
    console.log("✔ Técnico asignado:", asignacionActiva.tecnicoId, asignacionActiva.tecnicoNombre);
});
    document.getElementById('tipo-asignacion').onchange = function () {
        const tipo = this.value;
        resetMaterialAsignacion();
        asignacionActiva.tipo = tipo;
        const materialSelect = document.getElementById('material-asignacion');
        if (tipo) {
            cargarMaterialesAsignacion(tipo);
        } else {
            materialSelect.innerHTML = '<option value="">-- Seleccione tipo primero --</option>';
        }
    };
    document.getElementById('material-asignacion').onchange = function () {
        const codigo = this.value;
        asignacionActiva.materialCodigo = codigo;
        document.getElementById('contenedor-cantidad').style.display = 'none';
        document.getElementById('contenedor-ingreso-series').style.display = 'none';
        document.getElementById('contenedor-asignar-final').style.display = 'none';
        document.getElementById('cantidad-asignar').value = '';
        if (codigo) {
        document.getElementById('contenedor-cantidad').style.display = 'block';
        }
    };
    document.getElementById('btn-confirmar-cantidad').onclick = function () {
        const cantidadInput = document.getElementById('cantidad-asignar');
        const valor = parseInt(cantidadInput.value.trim());
        if (!valor || valor <= 0) {
            return mostrarToast("Ingrese una cantidad válida mayor a 0.", "error");
        }
        asignacionActiva.cantidad = valor;
        document.getElementById('contenedor-ingreso-series').style.display = 'block';
        const inputSerie = document.getElementById('input-serie');
        inputSerie.disabled = false; 
        inputSerie.value = '';
        inputSerie.focus();
        document.getElementById('lista-series-ingresadas').innerHTML = `<p><strong>Series (0/${valor}):</strong></p><ul></ul>`;
    };
    let timeoutSeries = null;

    const inputSerieEl = document.getElementById('input-serie');

    // Detectar pistola: solo dispara automático si hay 6+ caracteres (serie real)
    inputSerieEl.addEventListener('input', function () {
        if (timeoutSeries) clearTimeout(timeoutSeries);
        const val = this.value.trim();
        if (!val) return;
        // Solo auto-procesar si parece una serie completa (pistola)
        // Auto-disparo solo para series largas (pistola escáner >= 10 chars)
        // Para series cortas, usar Enter
        if (val.length >= 10) {
            timeoutSeries = setTimeout(() => {
                const current = inputSerieEl.value.trim();
                if (current.length >= 10) {
                    procesarSerieEscaneada(current);
                    inputSerieEl.value = '';
                    inputSerieEl.focus();
                }
            }, 400);
        }
    });

    // Enter: procesar sin importar largo (digitación manual)
    inputSerieEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (timeoutSeries) clearTimeout(timeoutSeries);
            const val = this.value.trim();
            if (val) {
                procesarSerieEscaneada(val);
                this.value = '';
                this.focus();
            }
        }
    });

function serieDisponibleEnBodega(serie) {
    // Buscar en ingresos seriados (equipos)
    for (const ing of appData.ingresosSeriados || []) {
        for (const eq of ing.equipos || []) {
            if (eq.serie1 === serie || eq.serie2 === serie) {
                // Verificar que no esté ya asignada a alguien
                const yaAsignada = appData.empleados.some(emp =>
                    emp.stock?.equipos?.some(e => e.serie1 === serie || e.serie2 === serie)
                );
                return !yaAsignada;
            }
        }
    }
    // Buscar en ingresos tarjetas
    for (const ing of appData.ingresosTarjetas || []) {
        for (const t of ing.tarjetas || []) {
            if (t.serie === serie) {
                const yaAsignada = appData.empleados.some(emp =>
                    emp.stock?.tarjetas?.some(x => x.serie === serie)
                );
                return !yaAsignada;
            }
        }
    }
    // Buscar en ingresos LNB
    for (const ing of appData.ingresosLNB || []) {
        for (const l of ing.lnbs || []) {
            if (l.serie === serie) {
                const yaAsignada = appData.empleados.some(emp =>
                    emp.stock?.lnbs?.some(x => x.serie === serie)
                );
                return !yaAsignada;
            }
        }
    }
    return false;
}

function renderListaSeries() {
    const cantidadEsperada = asignacionActiva.cantidad || 0;
    const lista = document.getElementById('lista-series-ingresadas');
    const hayErrores = asignacionActiva.seriesIngresadas.some(s => s._error);

    lista.innerHTML = `
        <p><strong>Series (${asignacionActiva.seriesIngresadas.length}/${cantidadEsperada}):</strong>
        ${hayErrores ? '<span style="color:#dc3545; margin-left:10px;">⚠️ Hay series con error — corrígelas antes de asignar</span>' : ''}
        </p>
        <ul style="list-style:none; padding:0; margin:0;">
        ${asignacionActiva.seriesIngresadas.map((s, idx) => {
            const serie = typeof s === 'object' ? s.valor : s;
            const error = typeof s === 'object' ? s._error : false;
            return `
            <li style="display:flex; align-items:center; gap:8px; padding:6px 10px; margin-bottom:6px;
                background:${error ? '#fff5f5' : '#f0fff4'}; border:1px solid ${error ? '#dc3545' : '#28a745'};
                border-radius:6px;">
                <span style="font-size:18px;">${error ? '❌' : '✅'}</span>
                ${error
                    ? `<input type="text" value="${serie}"
                        data-idx="${idx}"
                        onchange="corregirSerieAsignacion(this, ${idx})"
                        style="flex:1; padding:5px 8px; border:2px solid #dc3545; border-radius:4px;
                               font-family:monospace; font-size:14px; background:#fff;">
                       <span style="color:#dc3545; font-size:12px; white-space:nowrap;">No en bodega o ya asignada</span>`
                    : `<span style="font-family:monospace; font-size:14px; flex:1;">${serie}</span>`
                }
                <button onclick="eliminarSerieAsignacion(${idx})"
                    style="background:none; border:none; color:#999; cursor:pointer; font-size:16px; padding:0 4px;"
                    title="Eliminar">✕</button>
            </li>`;
        }).join('')}
        </ul>
    `;

    // Mostrar/ocultar botón de asignar
    const puedeAsignar = asignacionActiva.seriesIngresadas.length >= cantidadEsperada && !hayErrores;
    const contenedorFinal = document.getElementById('contenedor-asignar-final');
    if (contenedorFinal) contenedorFinal.style.display = puedeAsignar ? 'block' : 'none';
}

window.corregirSerieAsignacion = function(input, idx) {
    const nuevaSerie = input.value.trim();
    if (!nuevaSerie) return;

    // Verificar duplicado
    const otrasSeries = asignacionActiva.seriesIngresadas
        .filter((_, i) => i !== idx)
        .map(s => typeof s === 'object' ? s.valor : s);

    if (otrasSeries.includes(nuevaSerie)) {
        mostrarToast('⚠️ Serie duplicada', 'error');
        input.style.borderColor = '#dc3545';
        return;
    }

    const disponible = serieDisponibleEnBodega(nuevaSerie);
    asignacionActiva.seriesIngresadas[idx] = disponible
        ? nuevaSerie
        : { valor: nuevaSerie, _error: true };

    renderListaSeries();
};

window.eliminarSerieAsignacion = function(idx) {
    asignacionActiva.seriesIngresadas.splice(idx, 1);
    const inputSerieEl = document.getElementById('input-serie');
    if (inputSerieEl) { inputSerieEl.disabled = false; inputSerieEl.focus(); }
    renderListaSeries();
};

function procesarSerieEscaneada(serie) {
    if (!serie) return;

    const input = document.getElementById('input-serie');
    const cantidadEsperada = asignacionActiva.cantidad || 0;

    // Si ya completó la cantidad, no permitir más
    if (asignacionActiva.seriesIngresadas.length >= cantidadEsperada) {
        mostrarToast('Ya completó la cantidad solicitada.', 'error');
        input.value = '';
        input.disabled = true;
        return;
    }

    // Validar duplicado
    const seriesActuales = asignacionActiva.seriesIngresadas.map(s => typeof s === 'object' ? s.valor : s);
    if (seriesActuales.includes(serie)) {
        mostrarToast('Serie ya ingresada.', 'error');
        input.value = '';
        input.focus();
        return;
    }

    // Validar si está disponible en bodega
    const disponible = serieDisponibleEnBodega(serie);
    if (!disponible) {
        mostrarToast(`⚠️ Serie "${serie}" no está en bodega o ya está asignada`, 'error');
        asignacionActiva.seriesIngresadas.push({ valor: serie, _error: true });
    } else {
        asignacionActiva.seriesIngresadas.push(serie);
    }

    input.value = '';
    input.focus();
    renderListaSeries();

    if (asignacionActiva.seriesIngresadas.length >= cantidadEsperada) {
        const hayErrores = asignacionActiva.seriesIngresadas.some(s => s._error);
        if (!hayErrores) {
            mostrarToast('✅ Series completadas', 'success');
            setTimeout(() => {
                document.getElementById('contenedor-asignar-final').style.display = 'block';
                input.disabled = true;
            }, 500);
        } else {
            mostrarToast('⚠️ Hay series con error — corrígelas para continuar', 'error');
        }
    }
    const btnAsignar = document.getElementById('btn-asignar-material');
    if (btnAsignar) {
        // Evita listeners duplicados
        const nuevoBoton = btnAsignar.cloneNode(true);
        btnAsignar.parentNode.replaceChild(nuevoBoton, btnAsignar);
        document.getElementById('btn-asignar-material').addEventListener('click', async () => {
            try {
                await procesarAsignacionFinal();
            } catch (err) {
                console.error("❌ Error en asignación:", err);
                mostrarToast("Error al procesar la asignación. Revisar consola.", "error");
            }
        });
    }
}
}
function mostrarConfirmacion(mensaje, callbackSi, callbackNo = () => {}) {
    const modalExistente = document.getElementById('modal-confirmacion');
    if (modalExistente) modalExistente.remove();
    const modal = document.createElement('div');
    modal.id = 'modal-confirmacion';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); z-index: 2000; display: flex; justify-content: center; align-items: center;`;
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            <p style="font-size: 1.1em; margin: 0 0 20px;">${mensaje}</p>
            <div>
                <button id="btn-confirmar-si" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin-right: 10px;">Aceptar</button>
                <button id="btn-confirmar-no" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px;">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('btn-confirmar-si').onclick = () => {
        modal.remove();
        callbackSi();
    };
    document.getElementById('btn-confirmar-no').onclick = () => {
        modal.remove();
        callbackNo();
    };
}

// ================================
// ELIMINAR ORDEN POR NÚMERO
// ================================
async function eliminarOrdenPorNumero(numero) {
    if (!numero) {
        mostrarToast("❌ Número de orden inválido.", "error");
        return false;
    }

    const orden = ordenes.find(o => o.numero === numero);
    if (!orden) {
        mostrarToast(`❌ Orden #${numero} no encontrada.`, "error");
        return false;
    }

    // 🔒 NO permitir eliminar si tiene equipos/tarjetas/LNBs asignados
    const tieneEquipos =
        (orden.series_entrada && orden.series_entrada.length > 0) ||
        (orden.series_tarjetas && orden.series_tarjetas.length > 0) ||
        (orden.series_lnb && orden.series_lnb.length > 0) ||
        (orden.series_salida && orden.series_salida.length > 0);

    if (tieneEquipos) {
        mostrarToast("❌ Orden con equipos/tarjetas asignados. No se puede eliminar.", "error");
        return false;
    }

    // Confirmación
    if (!confirm(`⚠️ ¿Está seguro de eliminar la orden #${numero}? Esta acción es IRREVERSIBLE.`)) {
        return false;
    }

    try {
        // ✅ Eliminar en Supabase
        const { error } = await supabase
            .from('ordenes')
            .delete()
            .eq('numero', numero);

        if (error) throw error;

        // ✅ Eliminar en memoria
        const index = ordenes.findIndex(o => o.numero === numero);
        if (index !== -1) ordenes.splice(index, 1);

        await registrarBitacora(
            'eliminacion_orden',
            `Orden #${numero} eliminada`,
            `Cliente: ${orden.nombre_cliente || '—'} | Estado previo: ${orden.estado}`
        );

        mostrarToast(`✅ Orden #${numero} eliminada permanentemente.`, "success");
        return true;

    } catch (err) {
        console.error("🔥 Error al eliminar en Supabase:", err);
        mostrarToast("❌ Error al eliminar la orden en la nube.", "error");
        return false;
    }
}

// ================================
// REVERSAR ORDEN POR NÚMERO
// ================================
async function marcarEnProceso(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return mostrarToast('❌ Orden no encontrada.', 'error');

    if (orden.estado === 'En Proceso') {
        return mostrarToast('⚠️ La orden ya está En Proceso.', 'warning');
    }

    if (!confirm(`¿Marcar la orden #${orden.numero} como "En Proceso"?\n\nEl equipo quedará amarrado a la orden hasta liquidar o reversar.`)) return;

    try {
        const { error } = await supabase.from('ordenes')
            .update({ estado: 'En Proceso' })
            .eq('id', ordenId);
        if (error) throw error;

        orden.estado = 'En Proceso';
        aplicarFiltros();
        mostrarToast(`✅ Orden #${orden.numero} marcada como "En Proceso".`, 'success');
    } catch (err) {
        console.error('Error marcarEnProceso:', err);
        mostrarToast('❌ Error al actualizar la orden.', 'error');
    }
}

// ================================
// REVERSAR ORDEN POR NÚMERO - VERSIÓN FINAL
// ================================
async function reversarOrdenPorNumero(numero) {
    if (!numero) {
        mostrarToast("❌ Número de orden inválido.", "error");
        return false;
    }
    
    const orden = ordenes.find(o => o.numero === numero);
    if (!orden) {
        mostrarToast(`❌ Orden #${numero} no encontrada.`, "error");
        return false;
    }
    
    if (orden.estado !== "Liquidadas" && orden.estado !== "Rechazada" && orden.estado !== "En Proceso") {
        mostrarToast(`❌ Solo se pueden reversar órdenes en estado "Liquidadas", "Rechazada" o "En Proceso".`, "error");
        return false;
    }
    
    const confirmado = await new Promise(resolve => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 999999;
            display: flex; align-items: center; justify-content: center;`;
        modal.innerHTML = `
            <div style="background:white; border-radius:12px; padding:30px; max-width:450px; width:90%; box-shadow:0 8px 30px rgba(0,0,0,0.2);">
                <h3 style="margin:0 0 15px; color:#003366; text-align:center;">🔄 Reversar Orden #${numero}</h3>
                <div style="background:#fff3cd; border-left:4px solid #ffc107; padding:12px; border-radius:6px; margin-bottom:20px;">
                    <p style="margin:0 0 8px; color:#856404; font-weight:600;">⚠️ Ten en cuenta:</p>
                    <ul style="margin:0; padding-left:18px; color:#856404; font-size:14px; line-height:1.8;">
                        <li>Los equipos instalados <strong>volverán al stock</strong> del técnico.</li>
                        <li>Los datos de liquidación se <strong>conservan</strong> para editarlos.</li>
                        <li>Los equipos de retiro permanecen en la orden.</li>
                    </ul>
                </div>
                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button id="btn-cancelar-reversa-modal" style="padding:10px 22px; border:2px solid #ddd; background:white; color:#555; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600;">
                        Cancelar
                    </button>
                    <button id="btn-confirmar-reversa-modal" style="padding:10px 22px; border:none; background:#003366; color:white; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600;">
                        🔄 Sí, reversar
                    </button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('btn-confirmar-reversa-modal').onclick = () => { modal.remove(); resolve(true); };
        document.getElementById('btn-cancelar-reversa-modal').onclick = () => { modal.remove(); resolve(false); };
        modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); resolve(false); } });
    });

    if (!confirmado) return false;
    
    try {
        // === ✅ 1. OBTENER TÉCNICO DE LA ORDEN ===
        const tecnicoNombre = orden.tecnico?.trim();
        const tecnico = tecnicoNombre 
            ? appData.empleados.find(emp => `${emp.nombre1} ${emp.apepaterno}`.trim() === tecnicoNombre)
            : null;
        
        if (!tecnico) {
            mostrarToast("⚠️ No se encontró el técnico para restaurar stock.", "warning");
        }

        // === ✅ 2. FUNCIÓN AUXILIAR PARA RESTAURAR ASIGNACIÓN ===
        const restaurarAsignacion = async (tipo, series, tablaIngresos) => {
            if (!series || series.length === 0 || !tecnico) return;
            
            const seriesValidas = series.filter(s => s !== null && s !== '');
            if (seriesValidas.length === 0) return;

            console.log(`🔄 Restaurando ${seriesValidas.length} ${tipo}s al técnico ${tecnico.nombre1}...`);

            // 1. Buscar el artículo_codigo para cada serie
            const asignacionesPorArticulo = {};
            
            for (const serie of seriesValidas) {
                let articuloCodigo = null;
                const ingresoEncontrado = tablaIngresos.find(ing => {
                    if (tipo === 'equipo') {
                        return (ing.equipos || []).some(e => e.serie1 === serie || e.serie2 === serie);
                    } else {
                        return (ing[tipo === 'tarjeta' ? 'tarjetas' : 'lnbs'] || []).some(i => i.serie === serie);
                    }
                });
                
                if (ingresoEncontrado) {
                    articuloCodigo = ingresoEncontrado.articulo_codigo;
                    if (!asignacionesPorArticulo[articuloCodigo]) {
                        asignacionesPorArticulo[articuloCodigo] = [];
                    }
                    asignacionesPorArticulo[articuloCodigo].push(serie);
                }
            }

            // 2. Insertar/Actualizar en Supabase (asignaciones)
            for (const [codigo, seriesList] of Object.entries(asignacionesPorArticulo)) {
                const seriesParaDB = tipo === 'equipo' 
                    ? seriesList.map(s => ({ serie1: s, serie2: '' }))
                    : seriesList.map(s => ({ serie: s }));

                const {  existente } = await supabase
                    .from('asignaciones')
                    .select('*')
                    .eq('tecnico_id', tecnico.id)
                    .eq('articulo_codigo', codigo)
                    .eq('tipo', tipo)
                    .maybeSingle();

                if (existente) {
                    const seriesActuales = existente.series || [];
                    const seriesNuevas = seriesParaDB.filter(s => 
                        tipo === 'equipo' 
                        ? !seriesActuales.some(a => a.serie1 === s.serie1)
                        : !seriesActuales.some(a => a.serie === s.serie)
                    );
                    
                    if (seriesNuevas.length > 0) {
                        const seriesFinales = [...seriesActuales, ...seriesNuevas];
                        await supabase.from('asignaciones').update({ series: seriesFinales }).eq('id', existente.id);
                    }
                } else {
                    await supabase.from('asignaciones').insert({
                        tecnico_id: tecnico.id,
                        articulo_codigo: codigo,
                        tipo: tipo,
                        series: seriesParaDB,
                        fecha: new Date().toISOString().split('T')[0],
                        guia_salida: `REVERSA-${orden.numero}`
                    });
                }
            }

            // 3. Actualizar Stock Local (appData)
            if (tecnico.stock) {
                const stockKey = tipo === 'equipo' ? 'equipos' : (tipo === 'tarjeta' ? 'tarjetas' : 'lnbs');
                if (!tecnico.stock[stockKey]) tecnico.stock[stockKey] = [];
                
                seriesValidas.forEach(serie => {
                    const yaExiste = tecnico.stock[stockKey].some(item => 
                        tipo === 'equipo' ? item.serie1 === serie : item.serie === serie
                    );
                    if (!yaExiste) {
                        tecnico.stock[stockKey].push({
                            articuloCodigo: Object.keys(asignacionesPorArticulo).find(key => asignacionesPorArticulo[key].includes(serie)),
                            serie1: tipo === 'equipo' ? serie : '',
                            serie2: '',
                            serie: tipo !== 'equipo' ? serie : '',
                            fechaAsignacion: new Date().toISOString().split('T')[0],
                            guiaAsignacion: `REVERSA-${orden.numero}`
                        });
                    }
                });
            }
        };

        // === ✅ 3. RESTAURAR EQUIPOS INSTALADOS (series_entrada) ===
        await restaurarAsignacion('equipo', orden.series_entrada || [], appData.ingresosSeriados);

        // === ✅ 4. RESTAURAR TARJETAS INSTALADAS (series_tarjetas) ===
        const tarjetasValidas = (orden.series_tarjetas || []).filter(t => t !== null && t !== '');
        await restaurarAsignacion('tarjeta', tarjetasValidas, appData.ingresosTarjetas);

        // === ✅ 5. RESTAURAR LNBS INSTALADOS (series_lnb) ===
        await restaurarAsignacion('lnb', orden.series_lnb || [], appData.ingresosLNB);

        // === ✅ 6. EQUIPOS DE RETIRO - NO TOCAR (se mantienen en la orden) ===
        console.log(`♻️ Equipos de retiro (${orden.series_salida?.length || 0}) se mantienen asociados a la orden.`);

        // === ✅ 7. TARJETAS DE RETIRO - NO TOCAR (se mantienen en la orden) ===
        if (orden.series_salida_tarjetas && orden.series_salida_tarjetas.length > 0) {
            console.log(`♻️ Tarjetas de retiro (${orden.series_salida_tarjetas.length}) se mantienen asociadas a la orden.`);
        } else {
            console.log('ℹ️ No hay tarjetas de retiro en esta orden');
        }

        // === ✅ 8. ACTUALIZAR ORDEN EN SUPABASE ===
        const { error } = await supabase
            .from('ordenes')
            .update({
                estado: 'Agendada',
                equipo_reversado: false
            })
            .eq('numero', numero);
        
        if (error) throw error;
        
        // === ✅ 9. ACTUALIZAR EN MEMORIA LOCAL ===
        orden.estado = "Agendada";
        orden.equipo_reversado = false;
        
        // === ✅ 10. REFRESCAR DATOS Y UI ===
        await registrarBitacora(
            'reversa_orden',
            `Orden #${numero} reversada a Agendada`,
            `Técnico: ${orden.tecnico || '—'} | Estado previo: ${orden.estado}`
        );

        mostrarToast(`✅ Orden #${numero} revertida a "Agendada". 
        📦 Equipos instalados → VOLVIERON al stock del técnico (editables).
        ♻️ Equipos de retiro → Mantienen asociación con la orden.`, "success");
        
        // Refrescar vistas
        if (document.getElementById('panel-rechazadas')?.classList.contains('active')) {
            renderTablaRechazadas();
        }
        if (document.getElementById('panel-liquidadas')?.classList.contains('active')) {
            renderTablaLiquidadas();
        }
        if (document.getElementById('panel-agendadas')?.classList.contains('active')) {
            aplicarFiltros();
        }
        if (document.getElementById('panel-saldo-tecnico')?.classList.contains('active')) {
            renderSaldoTecnico();
        }
        
        return true;
        
    } catch (err) {
        console.error("🔥 Error al reversar:", err);
        mostrarToast("❌ Error al reversar la orden: " + err.message, "error");
        return false;
    }
}

async function guardarUsuario(event) {
    event.preventDefault();
    
    const rutInput = document.getElementById('usuario-rut')?.value.trim();
    const nombre = document.getElementById('usuario-nombre')?.value.trim();
    let rol = document.getElementById('usuario-rol')?.value;
    
    // ✅ Normalizar el valor del rol para que coincida con la base de datos
    if (rol === 'despacho-n1') rol = 'despacho N1';
    if (rol === 'despacho-n2') rol = 'despacho N2';
    
    const pass = document.getElementById('usuario-pass')?.value;
    
    // Validaciones
    if (!rutInput || !validarRutChileno(rutInput)) return mostrarToast("RUT inválido.", "error");
    if (!nombre) return mostrarToast("Nombre es obligatorio.", "error");
    if (!rol) return mostrarToast("Seleccione un rol.", "error");
    if (!pass || pass.length < 6) return mostrarToast("La contraseña debe tener al menos 6 caracteres.", "error");

    // Normalizar RUT
    const rutGuardar = normalizarRut(rutInput);

    // Verificar duplicados
    if (appData.usuarios.some(u => normalizarRut(u.rut) === rutGuardar)) {
        return mostrarToast("Este RUT ya tiene una cuenta de usuario.", "error");
    }

    // Crear nuevo usuario ✅ CORREGIDO: activo como valor literal true
    const nuevoUsuario = {
        rut: rutGuardar,
        nombre,
        rol,
        pass,
        activo: true,  // ✅ CORRECCIÓN: valor literal, no variable
        fechacreacion: new Date().toISOString().split('T')[0]
    };

    // Guardar en Supabase
    const { error } = await supabase.from('usuarios').insert([nuevoUsuario]);

    if (error) {
        console.error("Error al insertar usuario:", error);
        mostrarToast("❌ Error al guardar en la nube.", "error");
        return;
    }

    // Agregar a memoria local
    appData.usuarios.push(nuevoUsuario);
    
    // ✅ Mostrar mensaje de éxito
    mostrarToast(`✅ Usuario creado: ${nombre} (${rol})`, "success");
    
    // ✅ Limpiar formulario
    document.getElementById('usuario-rut').value = '';
    document.getElementById('usuario-nombre').value = '';
    document.getElementById('usuario-rol').selectedIndex = 0;
    document.getElementById('usuario-pass').value = '';

    renderListaUsuarios();
}

function renderListaUsuarios() {
    const contenedor = document.getElementById('lista-usuarios');
    if (!contenedor) return;

    const usuariosFiltrados = appData.usuarios.filter(u => 
        normalizarRut(u.rut) !== normalizarRut('11111111-1')
    );

    if (usuariosFiltrados.length === 0) {
        contenedor.innerHTML = '<p style="color:#6c757d;">No hay usuarios registrados.</p>';
        return;
    }

    let html = `
        <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr style="background:#f1f1f1;">
            <th style="border:1px solid #ddd; padding:8px;">RUT</th>
            <th style="border:1px solid #ddd; padding:8px;">Nombre</th>
            <th style="border:1px solid #ddd; padding:8px;">Rol</th>
            <th style="border:1px solid #ddd; padding:8px;">Creado</th>
            <th style="border:1px solid #ddd; padding:8px;">Estado</th>
            </tr>
        </thead>
        <tbody>`;

    usuariosFiltrados.forEach(u => {
        const estaActivo = u.activo !== false;
        html += `
        <tr>
            <td style="border:1px solid #ddd; padding:8px;">${u.rut}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.nombre}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.rol}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.fechacreacion}</td>
            <td style="border:1px solid #ddd; padding:8px; text-align:center;">
            <label class="switch" style="display: inline-block;">
                <input type="checkbox" class="toggle-activo-usuario" data-rut="${u.rut}" ${estaActivo ? 'checked' : ''}>
                <span class="slider round" style="display: inline-block; width: 36px; height: 20px;"></span>
            </label>
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;

    // Listeners a los nuevos toggles
    document.querySelectorAll('.toggle-activo-usuario').forEach(toggle => {
        toggle.addEventListener('change', async function () {
            const rutUsuario = this.dataset.rut;
            const nuevoEstado = this.checked;

            const usuario = appData.usuarios.find(u => u.rut === rutUsuario);
            if (!usuario) return;

            // Actualizar localmente
            usuario.activo = nuevoEstado;

            try {
                const { error } = await supabase
                .from('usuarios')
                .update({ activo: nuevoEstado })
                .eq('rut', rutUsuario);
            
            if (error) throw error;

            mostrarToast(`✅ Usuario "${usuario.nombre}" ${nuevoEstado ? 'activado' : 'desactivado'}.`, "success");
        } catch (err) {
            console.error("Error al actualizar estado del usuario:", err);
            mostrarToast("❌ Error al actualizar en la nube.", "error");
            // Revertir visualmente
            this.checked = !nuevoEstado;
            usuario.activo = !nuevoEstado;
        }
        });
    });
}

// Cargar artículos LNB en el select al cargar el panel
function cargarArticulosLNB() {
    const select = document.getElementById('articulo-lnb');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione --</option>';
    appData.articulos.lnbs.forEach(a => {
        if (!a.activo) return;
        const opt = document.createElement('option');
        opt.value = a.codigo;
        opt.textContent = `${a.nombre} (${a.codigo})`;
        select.appendChild(opt);
    });
}

function cerrarSesion() {
    sessionStorage.removeItem('usuarioActivo');
    window.location.reload(); // 🔄 Recarga la página completa
    
}

/**
 * Verifica si una serie existe en los ingresos del sistema (equipos, tarjetas o LNBs).
 * @param {string} serie - La serie a validar.
 * @returns {boolean} - true si existe, false si no.
 */
function serieExisteEnIngresos(serie) {
    if (!serie) return false;
    const norm = normalizarSerie(serie);

    // Buscar en EQUIPOS
    for (const ingreso of appData.ingresosSeriados || []) {
        for (const eq of ingreso.equipos || []) {
            if (normalizarSerie(eq.serie1) === norm || normalizarSerie(eq.serie2) === norm) {
                return true;
            }
        }
    }

    // Buscar en TARJETAS
    for (const ingreso of appData.ingresosTarjetas || []) {
        for (const t of ingreso.tarjetas || []) {
            if (normalizarSerie(t.serie) === norm) {
                return true;
            }
        }
    }

    // Buscar en LNBs
    for (const ingreso of appData.ingresosLNB || []) {
        for (const l of ingreso.lnbs || []) {
            if (normalizarSerie(l.serie) === norm) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Elimina una serie del sistema SOLO si está disponible en bodega.
 * BLOQUEA si está asignada a técnico o instalada en cliente.
 * @param {string} serie - La serie a eliminar.
 * @param {string} tipo - 'equipo', 'tarjeta' o 'lnb'.
 */
async function eliminarSerieDelSistema(serie, tipo) {
    try {
        const serieNormalizada = normalizarSerie(serie);
 
        // === 1. VALIDAR: ¿Está en orden LIQUIDADA? (única restricción) ===
        let ordenConSerie = null;
        for (const orden of ordenes) {
            if (orden.estado !== 'Liquidadas') continue;
            const todasSeries = [
                ...(orden.series_entrada || []),
                ...(orden.series_tarjetas || []),
                ...(orden.series_lnb || [])
            ].filter(s => s !== null && s !== undefined)
             .map(s => normalizarSerie(typeof s === 'object' ? (s.serie1 || s.serie) : s));
 
            if (todasSeries.includes(serieNormalizada)) {
                ordenConSerie = orden;
                break;
            }
        }
 
        if (ordenConSerie) {
            mostrarToast(`❌ No se puede eliminar. Serie instalada en orden liquidada #${ordenConSerie.numero}`, "error");
            return false;
        }
 
        // === 2. BUSCAR EN SUPABASE (tabla real: ingresos) ===
        const { data: ingresos, error: errBuscar } = await supabase
            .from('ingresos')
            .select('*');
 
        if (errBuscar) throw errBuscar;
 
        let ingresoEncontrado = null;
        let itemsRestantes = [];
 
        for (const ing of (ingresos || [])) {
            const series = ing.series || [];
            const hayCoincidencia = series.some(item => {
                if (!item) return false;
                return normalizarSerie(item.serie1 || '') === serieNormalizada ||
                       normalizarSerie(item.serie2 || '') === serieNormalizada ||
                       normalizarSerie(item.serie  || '') === serieNormalizada;
            });
 
            if (hayCoincidencia) {
                ingresoEncontrado = ing;
                // Series que QUEDAN después de eliminar la buscada
                itemsRestantes = series.filter(item => {
                    if (!item) return false;
                    return normalizarSerie(item.serie1 || '') !== serieNormalizada &&
                           normalizarSerie(item.serie2 || '') !== serieNormalizada &&
                           normalizarSerie(item.serie  || '') !== serieNormalizada;
                });
                break;
            }
        }
 
        if (!ingresoEncontrado) {
            mostrarToast("❌ La serie no existe en el sistema o ya fue eliminada.", "error");
            return false;
        }
 
        // === 3. CONFIRMAR ELIMINACIÓN ===
        const articulo = appData.articulos.seriados?.find(a => a.codigo === ingresoEncontrado.articulo_codigo)
            || appData.articulos.ferreteria?.find(a => a.codigo === ingresoEncontrado.articulo_codigo)
            || appData.articulos.lnbs?.find(a => a.codigo === ingresoEncontrado.articulo_codigo);
 
        const confirmado = await mostrarModalConfirmarEliminacionSerie(
            serie, tipo,
            articulo?.nombre || ingresoEncontrado.articulo_codigo,
            ingresoEncontrado.guia
        );
        if (!confirmado) return false;
 
        // === 4. ELIMINAR O ACTUALIZAR EN SUPABASE ===
        if (itemsRestantes.length === 0) {
            // Si no quedan series, eliminar el registro completo
            const { error } = await supabase
                .from('ingresos')
                .delete()
                .eq('id', ingresoEncontrado.id);
            if (error) throw error;
        } else {
            // Actualizar con las series restantes
            const { error } = await supabase
                .from('ingresos')
                .update({ series: itemsRestantes })
                .eq('id', ingresoEncontrado.id);
            if (error) throw error;
        }
 
        // === 5. TAMBIÉN ELIMINAR DE ASIGNACIONES SI ESTÁ ASIGNADA ===
        // Buscar en asignaciones de técnicos
        const { data: asignaciones } = await supabase
            .from('asignaciones')
            .select('*');
 
        for (const asig of (asignaciones || [])) {
            const tiposCampo = ['equipos', 'tarjetas', 'lnbs'];
            for (const campo of tiposCampo) {
                const items = asig[campo] || [];
                const hayMatch = items.some(item => {
                    if (!item) return false;
                    return normalizarSerie(item.serie1 || '') === serieNormalizada ||
                           normalizarSerie(item.serie2 || '') === serieNormalizada ||
                           normalizarSerie(item.serie  || '') === serieNormalizada;
                });
 
                if (hayMatch) {
                    const restantes = items.filter(item => {
                        if (!item) return false;
                        return normalizarSerie(item.serie1 || '') !== serieNormalizada &&
                               normalizarSerie(item.serie2 || '') !== serieNormalizada &&
                               normalizarSerie(item.serie  || '') !== serieNormalizada;
                    });
 
                    await supabase
                        .from('asignaciones')
                        .update({ [campo]: restantes })
                        .eq('id', asig.id);
                }
            }
        }
 
        // === 6. ACTUALIZAR APPDATA LOCAL ===
        ['ingresosSeriados', 'ingresosTarjetas', 'ingresosLNB'].forEach(key => {
            appData[key] = (appData[key] || []).map(i => {
                if (i.id !== ingresoEncontrado.id) return i;
                return { ...i, series: itemsRestantes };
            }).filter(i => (i.series || []).length > 0);
        });
 
        // Actualizar stock de empleados en memoria
        appData.empleados?.forEach(emp => {
            if (!emp.stock) return;
            ['equipos', 'tarjetas', 'lnbs'].forEach(campo => {
                if (!emp.stock[campo]) return;
                emp.stock[campo] = emp.stock[campo].filter(item => {
                    if (!item) return false;
                    return normalizarSerie(item.serie1 || '') !== serieNormalizada &&
                           normalizarSerie(item.serie2 || '') !== serieNormalizada &&
                           normalizarSerie(item.serie  || '') !== serieNormalizada;
                });
            });
        });
 
        // === 7. REGISTRAR EN BITÁCORA ===
        const usuario = window.usuarioActivo?.nombre || 'Usuario desconocido';
        await supabase.from('bitacora').insert({
            serie: serie,
            tipo: tipo,
            codigo_articulo: ingresoEncontrado.articulo_codigo,
            usuario: usuario,
            fecha_eliminacion: new Date().toISOString(),
            observacion: 'eliminacion_serie'
        });
        
        await registrarBitacora(
            'eliminacion_serie',
            `Serie ${serie} eliminada`,
            `Tipo: ${tipo} | Artículo: ${ingresoEncontrado.articulo_codigo} | Usuario: ${usuario}`
        );

        // === 8. ÉXITO ===
        mostrarToast(`✅ Serie "${serie}" eliminada completamente del sistema.`, "success");
 
        if (document.getElementById('panel-gestion-bodega')?.classList.contains('active')) {
            calcularSaldoBodega();
        }
 
        return true;
 
    } catch (err) {
        console.error("❌ Error al eliminar serie:", err);
        mostrarToast(`❌ Error: ${err.message || 'Verifique la consola'}`, "error");
        return false;
    }
}

/**
 * Muestra modal personalizado para confirmar eliminación de serie
 */
function mostrarModalConfirmarEliminacionSerie(serie, tipo, articulo, guia) {
    return new Promise((resolve) => {
        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'modal-confirmar-eliminacion';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(3px);
        `;
        
        const tipoIcono = tipo === 'equipo' ? '📺' : tipo === 'tarjeta' ? '💳' : '📡';
        const tipoLabel = tipo === 'equipo' ? 'Equipo' : tipo === 'tarjeta' ? 'Tarjeta' : 'LNB';
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                animation: modalSlideIn 0.3s ease-out;
            ">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="
                        font-size: 48px;
                        margin-bottom: 10px;
                    ">⚠️</div>
                    <h3 style="
                        margin: 0;
                        color: #1e293b;
                        font-size: 22px;
                        font-weight: 700;
                    ">¿Eliminar permanentemente?</h3>
                </div>
                
                <div style="
                    background: #f8fafc;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 6px;
                ">
                    <p style="margin: 0 0 10px 0; color: #1e293b; font-weight: 600;">
                        ${tipoIcono} Serie: <strong style="color: #dc2626;">${serie}</strong>
                    </p>
                    <p style="margin: 5px 0; color: #475569; font-size: 14px;">
                        <strong>Tipo:</strong> ${tipoLabel}
                    </p>
                    <p style="margin: 5px 0; color: #475569; font-size: 14px;">
                        <strong>Artículo:</strong> ${articulo}
                    </p>
                    ${guia && guia !== '—' ? `
                    <p style="margin: 5px 0; color: #475569; font-size: 14px;">
                        <strong>Guía:</strong> ${guia}
                    </p>
                    ` : ''}
                </div>
                
                <div style="
                    background: #dcfce7;
                    border: 1px solid #86efac;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <span style="font-size: 20px;">✅</span>
                    <span style="color: #166534; font-weight: 600; font-size: 14px;">
                        La serie está DISPONIBLE en bodega
                    </span>
                </div>
                
                <div style="
                    background: #fef3c7;
                    border: 1px solid #fcd34d;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <span style="font-size: 20px;">⚠️</span>
                    <span style="color: #92400e; font-weight: 600; font-size: 14px;">
                        Esta acción NO se puede deshacer
                    </span>
                </div>
                
                <div style="
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                ">
                    <button id="btn-cancelar-eliminacion" style="
                        padding: 12px 24px;
                        border: 2px solid #e2e8f0;
                        background: white;
                        color: #475569;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 15px;
                    ">
                        Cancelar
                    </button>
                    <button id="btn-confirmar-eliminacion" style="
                        padding: 12px 24px;
                        border: none;
                        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                        color: white;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 15px;
                        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                    ">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            #btn-cancelar-eliminacion:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }
            
            #btn-confirmar-eliminacion:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            }
            
            #btn-cancelar-eliminacion:active,
            #btn-confirmar-eliminacion:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Event listeners
        const btnCancelar = document.getElementById('btn-cancelar-eliminacion');
        const btnConfirmar = document.getElementById('btn-confirmar-eliminacion');
        
        const cerrarModal = () => {
            modal.style.animation = 'modalSlideIn 0.2s ease-out reverse';
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 200);
            resolve(false);
        };
        
        btnCancelar.onclick = cerrarModal;
        btnConfirmar.onclick = () => {
            modal.style.animation = 'modalSlideIn 0.2s ease-out reverse';
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 200);
            resolve(true);
        };
        
        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                cerrarModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // Cerrar clickeando fuera
        modal.onclick = (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        };
    });
}

/**
 * ⚠️ FUNCIÓN DE EMERGENCIA: Elimina una serie del sistema SIN VALIDAR si está asignada o instalada.
 * Úsela solo para limpiar datos incorrectos. Registra la acción en bitácora.
 */
async function eliminarSerieDelSistemaSinRestricciones() {
    const input = document.getElementById('eliminar-serie-input');
    const resultadoDiv = document.getElementById('resultado-eliminar-serie');
    if (!input || !resultadoDiv) return;

    const serie = input.value.trim();
    if (!serie) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ Ingrese un número de serie.</p>';
        return;
    }

    resultadoDiv.innerHTML = '<p>🔍 Buscando serie en el sistema...</p>';

    // === 1. Buscar la serie en los ingresos para obtener su origen ===
    let tipoEncontrado = null;
    let codigoArticulo = null;
    let tablaOrigen = null;
    let ingresoEncontrado = null;

    // Buscar en equipos
    for (const ing of appData.ingresosSeriados || []) {
        const eq = (ing.equipos || []).find(e => e.serie1 === serie || e.serie2 === serie);
        if (eq) {
            tipoEncontrado = 'equipo';
            codigoArticulo = ing.articulo_codigo;
            tablaOrigen = 'ingresos_seriados';
            ingresoEncontrado = ing;
            break;
        }
    }

    // Buscar en tarjetas
    if (!tipoEncontrado) {
        for (const ing of appData.ingresosTarjetas || []) {
            const t = (ing.tarjetas || []).find(tt => tt.serie === serie);
            if (t) {
                tipoEncontrado = 'tarjeta';
                codigoArticulo = ing.articulo_codigo;
                tablaOrigen = 'ingresos_tarjetas';
                ingresoEncontrado = ing;
                break;
            }
        }
    }

    // Buscar en LNBs
    if (!tipoEncontrado) {
        for (const ing of appData.ingresosLNB || []) {
            const l = (ing.lnbs || []).find(ll => ll.serie === serie);
            if (l) {
                tipoEncontrado = 'lnb';
                codigoArticulo = ing.articulo_codigo;
                tablaOrigen = 'ingresos_lnb';
                ingresoEncontrado = ing;
                break;
            }
        }
    }

    if (!tipoEncontrado) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ La serie no existe en el sistema.</p>';
        return;
    }

    // === 2. Confirmación con advertencia explícita ===
    if (!confirm(`⚠️ ¡ATENCIÓN!\n\nEstá a punto de eliminar la serie "${serie}" del sistema, incluso si está asignada o instalada.\n\nEsta acción es irreversible y puede causar inconsistencias.\n\n¿Desea continuar?`)) {
        return;
    }

    try {
        // === 3. Eliminar de la tabla de origen ===
        let nuevasSeries = [];
        if (tipoEncontrado === 'equipo') {
            nuevasSeries = ingresoEncontrado.equipos.filter(eq => eq.serie1 !== serie && eq.serie2 !== serie);
        } else if (tipoEncontrado === 'tarjeta') {
            nuevasSeries = ingresoEncontrado.tarjetas.filter(t => t.serie !== serie);
        } else if (tipoEncontrado === 'lnb') {
            nuevasSeries = ingresoEncontrado.lnbs.filter(l => l.serie !== serie);
        }

        if (nuevasSeries.length === 0) {
            // Eliminar todo el registro si no quedan series
            await supabase.from(tablaOrigen).delete().eq('id', ingresoEncontrado.id);
        } else {
            // Actualizar solo las series
            await supabase.from(tablaOrigen).update({
                [tipoEncontrado === 'equipo' ? 'equipos' : tipoEncontrado === 'tarjeta' ? 'tarjetas' : 'lnbs']: nuevasSeries
            }).eq('id', ingresoEncontrado.id);
        }

        // === 4. Actualizar appData local ===
        if (tipoEncontrado === 'equipo') {
            appData.ingresosSeriados = appData.ingresosSeriados.map(i =>
                i.id === ingresoEncontrado.id ? { ...i, equipos: nuevasSeries } : i
            ).filter(i => (i.equipos || []).length > 0);
        } else if (tipoEncontrado === 'tarjeta') {
            appData.ingresosTarjetas = appData.ingresosTarjetas.map(i =>
                i.id === ingresoEncontrado.id ? { ...i, tarjetas: nuevasSeries } : i
            ).filter(i => (i.tarjetas || []).length > 0);
        } else if (tipoEncontrado === 'lnb') {
            appData.ingresosLNB = appData.ingresosLNB.map(i =>
                i.id === ingresoEncontrado.id ? { ...i, lnbs: nuevasSeries } : i
            ).filter(i => (i.lnbs || []).length > 0);
        }

        // === 5. Registrar en bitácora ===
        const usuario = window.usuarioActivo?.nombre || 'Usuario desconocido';
        await supabase.from('bitacora').insert({
            serie: serie,
            tipo: tipo,
            codigo_articulo: ingresoEncontrado.articulo_codigo,
            usuario: usuario,
            fecha_eliminacion: new Date().toISOString(),
            observacion: 'eliminacion_serie'
        });

        // === 6. Éxito ===
        resultadoDiv.innerHTML = `<p style="color:#28a745;">✅ Serie "${serie}" eliminada del sistema (modo emergencia).</p>`;
        input.value = '';

        // Opcional: refrescar paneles relevantes
        if (document.getElementById('panel-gestion-bodega')?.classList.contains('active')) {
            calcularSaldoBodega();
        }

    } catch (err) {
        console.error("Error al eliminar serie:", err);
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">❌ Error al eliminar la serie. Verifique la consola.</p>`;
    }
}


/**
 * Habilita los campos del formulario según el tipo
 */

// ================================
// === DEVOLUCIÓN DE EQUIPOS -  ===
// ================================
// ============================================================
// MÓDULO DEVOLUCIÓN DE EQUIPOS - REESCRITURA COMPLETA
// Reemplaza las funciones: cambiarTipoDevolucion, habilitarCantidad,
// generarCamposSeriesDevolucion, validarSerieDevolucion,
// verificarCompletitudSeries, registrarDevolucion
// ============================================================

// ─── ESTADO GLOBAL DEL MÓDULO ───────────────────────────────
const devolucionState = {
    nmalos: {
        tecnico: null,
        stockEquipos: [],   // [{serie1, serie2, articuloCodigo, ...}]
        seriesSeleccionadas: []
    },
    reversa: {
        tecnico: null,
        seriesIngresadas: []
    }
};



// ─── 2. RESET DE FORMULARIO ─────────────────────────────────
function resetFormulario(tipo) {
    const selectTecnico = document.getElementById(`tecnico-${tipo}`);
    const inputCantidad = document.getElementById(`cantidad-${tipo}`);
    const contenedorSeries = document.getElementById(`contenedor-series-${tipo}`);
    const inputsSeries = document.getElementById(`inputs-series-${tipo}`);
    const btnRegistrar = document.getElementById(`btn-registrar-${tipo}`);

    if (selectTecnico) selectTecnico.value = '';
    if (inputCantidad) { inputCantidad.value = ''; inputCantidad.disabled = true; }
    if (contenedorSeries) contenedorSeries.style.display = 'none';
    if (inputsSeries) inputsSeries.innerHTML = '';
    if (btnRegistrar) btnRegistrar.disabled = true;

    // Ocultar campos extra
    ['grupo-fecha', 'grupo-observacion', 'grupo-guia'].forEach(id => {
        const el = document.getElementById(`${id}-${tipo}`);
        if (el) el.style.display = 'none';
    });

    // Limpiar estado
    if (tipo === 'nmalos') {
        devolucionState.nmalos.tecnico = null;
        devolucionState.nmalos.stockEquipos = [];
        devolucionState.nmalos.seriesSeleccionadas = [];
    } else {
        devolucionState.reversa.tecnico = null;
        devolucionState.reversa.seriesIngresadas = [];
    }
}

// ─── 3. CARGAR TÉCNICOS ─────────────────────────────────────
function cargarTecnicosDevolucion(tipo) {
    const selectId = `tecnico-${tipo}`;
    const select = document.getElementById(selectId);
    if (!select) return;

    // Usar appData que ya está cargado al inicio de la app
    const empleados = appData?.empleados || [];

    // Filtrar técnicos activos que tengan stock de equipos
    const tecnicos = empleados.filter(emp => {
        const esActivo = emp.activo === true || emp.activo === 1 || emp.activo === 'true';
        const tieneStock = emp.stock?.equipos?.length > 0;
        // Si cargo no está disponible, usar stock como criterio de técnico
        const esTecnico = emp.cargo ? esCargoTecnico(emp.cargo) : tieneStock;
        if (tipo === 'nmalos') {
            return esActivo && esTecnico && tieneStock;
        }
        return esActivo && esTecnico;
    });

    select.innerHTML = '<option value="">-- Seleccione técnico --</option>';

    if (tecnicos.length === 0) {
        const msg = tipo === 'nmalos'
            ? '-- No hay técnicos con equipos en stock --'
            : '-- No hay técnicos activos --';
        select.innerHTML = `<option value="">${msg}</option>`;
        return;
    }

    tecnicos
        .sort((a, b) => {
            const nA = `${a.nombre1} ${a.apepaterno}`.toLowerCase();
            const nB = `${b.nombre1} ${b.apepaterno}`.toLowerCase();
            return nA.localeCompare(nB);
        })
        .forEach(emp => {
            const nombre = `${emp.nombre1} ${emp.apepaterno} ${emp.apematerno || ''}`.trim();
            const cantEquipos = emp.stock?.equipos?.length || 0;
            const opt = document.createElement('option');
            opt.value = emp.id;
            // Para nmalos mostrar cuántos equipos tiene
            opt.textContent = tipo === 'nmalos'
                ? `${nombre} (${cantEquipos} equipo${cantEquipos !== 1 ? 's' : ''})`
                : nombre;
            select.appendChild(opt);
        });
}

// ─── 4. HABILITAR CANTIDAD (al seleccionar técnico) ─────────
async function habilitarCantidad(tipo) {
    const selectTecnico = document.getElementById(`tecnico-${tipo}`);
    const inputCantidad = document.getElementById(`cantidad-${tipo}`);
    const contenedorSeries = document.getElementById(`contenedor-series-${tipo}`);
    const inputsSeries = document.getElementById(`inputs-series-${tipo}`);
    const btnRegistrar = document.getElementById(`btn-registrar-${tipo}`);

    if (!selectTecnico || !selectTecnico.value) return;

    const tecnicoId = selectTecnico.value;

    // Limpiar estado previo
    if (contenedorSeries) contenedorSeries.style.display = 'none';
    if (inputsSeries) inputsSeries.innerHTML = '';
    if (btnRegistrar) btnRegistrar.disabled = true;
    if (inputCantidad) { inputCantidad.value = ''; inputCantidad.disabled = true; }

    if (tipo === 'nmalos') {
        // Tomar stock directo desde appData (ya cargado al inicio)
        const tecnico = appData.empleados.find(e => e.id === tecnicoId);
        const stock = tecnico?.stock?.equipos || [];

        devolucionState.nmalos.tecnico = tecnicoId;
        devolucionState.nmalos.stockEquipos = stock;

        if (stock.length === 0) {
            mostrarToast('⚠️ Este técnico no tiene equipos en stock', 'warning');
            return;
        }

        mostrarToast(`✅ Técnico tiene ${stock.length} equipo(s) en stock`, 'success');
        if (inputCantidad) {
            inputCantidad.max = stock.length;
            inputCantidad.disabled = false;
            inputCantidad.focus();
        }

    } else {
        // Para Reversa: cargar órdenes liquidadas pendientes del técnico
        devolucionState.reversa.tecnico = tecnicoId;
        await cargarOrdenesReversaPendiente(tecnicoId);
    }
}


// ─── 6. GENERAR CAMPOS DE SERIES ────────────────────────────
function generarCamposSeriesDevolucion(tipo) {
    const inputCantidad = document.getElementById(`cantidad-${tipo}`);
    const contenedorSeries = document.getElementById(`contenedor-series-${tipo}`);
    const inputsSeries = document.getElementById(`inputs-series-${tipo}`);

    if (!inputCantidad || !contenedorSeries || !inputsSeries) {
        console.error(`❌ Elementos no encontrados para tipo: ${tipo}`);
        return;
    }

    const cantidad = parseInt(inputCantidad.value);

    if (!cantidad || cantidad < 1) {
        contenedorSeries.style.display = 'none';
        return;
    }

    // Limpiar inputs anteriores
    inputsSeries.innerHTML = '';

    if (tipo === 'nmalos') {
        generarInputsNmalos(cantidad, inputsSeries);
    } else {
        generarInputsReversa(cantidad, inputsSeries);
    }

    contenedorSeries.style.display = 'block';

    // Scroll suave hacia los campos
    setTimeout(() => contenedorSeries.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

// ─── 6a. INPUTS PARA NMALOS (con datalist del stock) ────────
function generarInputsNmalos(cantidad, contenedor) {
    const stock = devolucionState.nmalos.stockEquipos;

    // Crear datalist con series disponibles del técnico
    const datalistId = 'datalist-series-nmalos';
    let datalist = document.getElementById(datalistId);
    if (datalist) datalist.remove();

    datalist = document.createElement('datalist');
    datalist.id = datalistId;

    stock.forEach(item => {
        if (item.serie1) {
            const opt = document.createElement('option');
            opt.value = item.serie1;
            opt.label = item.articuloNombre || item.articuloCodigo || '';
            datalist.appendChild(opt);
        }
        if (item.serie2) {
            const opt = document.createElement('option');
            opt.value = item.serie2;
            opt.label = item.articuloNombre || item.articuloCodigo || '';
            datalist.appendChild(opt);
        }
    });
    document.body.appendChild(datalist);

    // Generar inputs
    for (let i = 1; i <= cantidad; i++) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex; align-items:center; gap:10px; margin-bottom:10px; padding:10px; background:#fff; border:1px solid #ddd; border-radius:6px;';
        wrapper.id = `wrapper-nmalo-${i}`;

        wrapper.innerHTML = `
            <span style="font-weight:600; color:#dc3545; min-width:80px;">Equipo ${i}:</span>
            <input type="text" 
                   id="serie-nmalos-${i}" 
                   list="${datalistId}"
                   placeholder="Serie (del stock del técnico)" 
                   autocomplete="off"
                   style="flex:1; padding:8px 12px; border:2px solid #ddd; border-radius:6px; font-size:14px;"
                   oninput="validarSeriePorInput(this, 'nmalos', ${i})">
            <span id="estado-serie-nmalos-${i}" style="font-size:18px; min-width:25px;"></span>
            <span id="modelo-serie-nmalos-${i}" style="font-size:12px; color:#666; min-width:100px;"></span>
        `;
        contenedor.appendChild(wrapper);
    }

    // Listener en el último input para mostrar campos siguientes
    const ultimoInput = document.getElementById(`serie-nmalos-${cantidad}`);
    if (ultimoInput) {
        ultimoInput.addEventListener('change', () => verificarCompletitudNmalos(cantidad));
    }
}

// ─── 6b. INPUTS PARA REVERSA (ingreso libre) ────────────────
// ─── REVERSA: CARGAR ÓRDENES LIQUIDADAS DEL TÉCNICO ────────
async function cargarOrdenesReversaPendiente(tecnicoId) {
    const contenedor = document.getElementById('contenedor-ordenes-reversa');
    const wrapper = document.getElementById('lista-ordenes-reversa');
    if (!contenedor || !wrapper) return;
 
    contenedor.style.display = 'none';
    wrapper.innerHTML = '<p style="color:#666;">⏳ Buscando órdenes...</p>';
    contenedor.style.display = 'block';
 
    const tecnico = appData.empleados.find(e => e.id === tecnicoId);
    const nombreTecnico = tecnico ? `${tecnico.nombre1} ${tecnico.apepaterno}`.trim() : '';
 
    const ordenesConReversa = ordenes.filter(o => {
        const esTecnico = o.tecnico === nombreTecnico || o.tecnico === tecnicoId;
        const esLiquidada = o.estado === 'Liquidadas' || o.estado === 'Liquidada';
        const noReversada = !o.equipo_reversado;
 
        // ✅ FIX: considera también órdenes con solo tarjetas de retiro
        const tieneEquipos  = Array.isArray(o.series_salida) && o.series_salida.length > 0;
        const tieneTarjetas = Array.isArray(o.series_salida_tarjetas) && o.series_salida_tarjetas.length > 0;
 
        return esTecnico && esLiquidada && (tieneEquipos || tieneTarjetas) && noReversada;
    });
 
    if (ordenesConReversa.length === 0) {
        wrapper.innerHTML = '<p style="color:#888; padding:15px;">✅ No hay órdenes pendientes de reversa para este técnico.</p>';
        return;
    }
 
    wrapper.innerHTML = '';
    ordenesConReversa.forEach(orden => {
        const seriesEquipos  = orden.series_salida || [];
        const seriesTarjetas = (orden.series_salida_tarjetas || [])
            .filter(s => s !== null && s !== undefined && s !== '')
            .map(s => typeof s === 'object' ? (s.serie || s.serie1) : s);
 
        const card = document.createElement('div');
        card.style.cssText = 'background:#fff; border:1px solid #cce5ff; border-radius:8px; padding:15px; margin-bottom:12px;';
        card.id = `orden-reversa-${orden.id}`;
 
        // Lista de equipos
        const listaEquipos = seriesEquipos.length > 0
            ? `<div style="margin-top:8px;">
                <strong style="font-size:13px;">📦 Equipos a reversar (${seriesEquipos.length}):</strong><br>
                ${seriesEquipos.map(s =>
                    `<span style="display:inline-block;background:#e7f3ff;border:1px solid #007bff;border-radius:4px;padding:3px 10px;margin:3px;font-family:monospace;font-size:13px;">${s}</span>`
                ).join('')}
               </div>`
            : '';
 
        // Lista de tarjetas ← NUEVO
        const listaTarjetas = seriesTarjetas.length > 0
            ? `<div style="margin-top:8px;">
                <strong style="font-size:13px;">🃏 Tarjetas a reversar (${seriesTarjetas.length}):</strong><br>
                ${seriesTarjetas.map(s =>
                    `<span style="display:inline-block;background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:3px 10px;margin:3px;font-family:monospace;font-size:13px;">${s}</span>`
                ).join('')}
               </div>`
            : '';
 
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                <div>
                    <strong style="font-size:15px; color:#007bff;">📋 Orden: ${orden.numero}</strong>
                    <strong style="font-size:15px; color:#007bff;">📋 Rut: ${orden.rut_cliente}</strong>
                    <span style="margin-left:10px; color:#666; font-size:13px;">${orden.nombre_cliente || ''}</span>
                    <div style="color:#555; font-size:13px; margin-top:4px;">📅 ${orden.fecha_liquidacion || orden.fecha} — ${orden.servicio || ''} ${orden.subservicio || ''}</div>
                    ${listaEquipos}
                    ${listaTarjetas}
                </div>
                <button onclick="confirmarReversaOrden('${orden.id}', '${orden.numero}')"
                    style="background:#007bff; color:#fff; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:600; font-size:14px; white-space:nowrap;">
                    ✅ Confirmar Recepción
                </button>
            </div>
        `;
        wrapper.appendChild(card);
    });
}

// ─── REVERSA: CONFIRMAR RECEPCIÓN DE UNA ORDEN ──────────────
// ─── REVERSA: CONFIRMAR RECEPCIÓN DE UNA ORDEN ──────────────
async function confirmarReversaOrden(ordenId, numeroOrden) {
    const btn = document.querySelector(`#orden-reversa-${ordenId} button`);
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Registrando...'; }
    try {
        const orden = ordenes.find(o => o.id === ordenId);
        if (!orden) throw new Error('Orden no encontrada en memoria');

        const seriesEquipos  = orden.series_salida || [];
        const seriesTarjetas = (orden.series_salida_tarjetas || [])
            .filter(s => s !== null && s !== undefined && s !== '')
            .map(s => typeof s === 'object' ? (s.serie || s.serie1) : s);

        const tecnicoId = devolucionState.reversa.tecnico;
        const tecnico = appData.empleados.find(e => e.id === tecnicoId);
        const nombreTecnico = tecnico ? `${tecnico.nombre1} ${tecnico.apepaterno}`.trim() : tecnicoId;
        
        // ✅ FUNCIÓN AUXILIAR PARA LA FECHA
        function obtenerFechaLocal() {
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        // ✅ CORRECCIÓN: EJECUTAR LA FUNCIÓN Y GUARDAR EN 'fecha'
        const fecha = obtenerFechaLocal(); 

        // 1. Registros de equipos
        const registrosEquipos = seriesEquipos.map(serie => ({
            tipo: 'reversa',
            serie: serie,
            guia: orden.numero,
            fecha: fecha,  // <-- Ahora 'fecha' sí existe
            numero_orden: numeroOrden,
            tecnico: nombreTecnico,
            articulo: null
        }));

        // 2. Registros de tarjetas
        const registrosTarjetas = seriesTarjetas.map(serie => ({
            tipo: 'tarjeta',
            serie: serie,
            guia: orden.numero,
            fecha: fecha,  // <-- Ahora 'fecha' sí existe
            numero_orden: numeroOrden,
            tecnico: nombreTecnico,
            articulo: null
        }));

        const todosLosRegistros = [...registrosEquipos, ...registrosTarjetas];

        if (todosLosRegistros.length === 0) {
            mostrarToast('⚠️ Esta orden no tiene series de retiro.', 'info');
            if (btn) { btn.disabled = false; btn.textContent = '✅ Confirmar Recepción'; }
            return;
        }

        // 3. Insertar en bodega_reversa
        const { error: errInsert } = await supabase
            .from('bodega_reversa')
            .insert(todosLosRegistros);

        if (errInsert) throw errInsert;

        // 4. Marcar la orden como reversada en Supabase
        const { error: errUpdate } = await supabase
            .from('ordenes')
            .update({ equipo_reversado: true })
            .eq('id', ordenId);

        if (errUpdate) throw errUpdate;

        // 5. Actualizar en memoria local
        const idx = ordenes.findIndex(o => o.id === ordenId);
        if (idx >= 0) ordenes[idx].equipo_reversado = true;

        // 6. Actualizar bodegaReversa en appData
        todosLosRegistros.forEach(r => appData.bodegaReversa.push(r));

        // 7. Quitar la card de la vista
        const card = document.getElementById(`orden-reversa-${ordenId}`);
        if (card) {
            card.style.background = '#d4edda';
            card.innerHTML = `<p style="color:#155724; padding:5px;">✅ Orden ${numeroOrden} — ${registrosEquipos.length} equipo(s) y ${registrosTarjetas.length} tarjeta(s) recibido(s) en bodega.</p>`;
            setTimeout(() => card.remove(), 2500);
        }

        await registrarBitacora(
            'reversa_equipo',
            `Orden #${numeroOrden} — equipos recibidos en bodega`,
            `Técnico: ${nombreTecnico} | Equipos: ${registrosEquipos.length} | Tarjetas: ${registrosTarjetas.length}`
        );

        mostrarToast(`✅ Orden ${numeroOrden}: ${todosLosRegistros.length} serie(s) registrada(s) en Bodega Reversa`, 'success');

    } catch (err) {
        console.error('Error confirmando reversa:', err);
        mostrarToast('❌ Error: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.textContent = '✅ Confirmar Recepción'; }
    }
}

function generarInputsReversa(cantidad, contenedor) {
    // Función legacy — en Reversa ya no se usan inputs manuales
    // La lógica ahora es por órdenes liquidadas (cargarOrdenesReversaPendiente)
    console.warn('generarInputsReversa: flujo legacy, usar cargarOrdenesReversaPendiente');
}

// ─── 7. VALIDAR SERIE EN NMALOS ─────────────────────────────
function validarSeriePorInput(input, tipo, indice) {
    const serie = input.value.trim();
    const estadoEl = document.getElementById(`estado-serie-${tipo}-${indice}`);
    const modeloEl = document.getElementById(`modelo-serie-${tipo}-${indice}`);

    if (!serie) {
        input.style.borderColor = '#ddd';
        if (estadoEl) estadoEl.textContent = '';
        if (modeloEl) modeloEl.textContent = '';
        return;
    }

    const stock = devolucionState.nmalos.stockEquipos;
    const encontrado = stock.find(item => 
        item.serie1 === serie || item.serie2 === serie
    );

    if (encontrado) {
        input.style.borderColor = '#28a745';
        if (estadoEl) estadoEl.textContent = '✅';
        if (modeloEl) modeloEl.textContent = encontrado.articuloNombre || encontrado.articuloCodigo || '';
    } else {
        input.style.borderColor = '#dc3545';
        if (estadoEl) estadoEl.textContent = '❌';
        if (modeloEl) modeloEl.textContent = 'No en stock';
    }
}

// ─── 8. MARCAR SERIE EN REVERSA ─────────────────────────────
function marcarSerieReversa(input, indice, total) {
    const serie = input.value.trim();
    const estadoEl = document.getElementById(`estado-serie-reversa-${indice}`);

    if (!serie) {
        input.style.borderColor = '#ddd';
        if (estadoEl) estadoEl.textContent = '';
        return;
    }

    input.style.borderColor = '#28a745';
    if (estadoEl) estadoEl.textContent = '✅';

    // Si es el último, verificar completitud
    if (indice === total) {
        verificarCompletitudReversa(total);
    }
}

// ─── 9. VERIFICAR COMPLETITUD NMALOS ────────────────────────
function verificarCompletitudNmalos(cantidad) {
    const stock = devolucionState.nmalos.stockEquipos;
    let todasValidas = true;

    for (let i = 1; i <= cantidad; i++) {
        const input = document.getElementById(`serie-nmalos-${i}`);
        if (!input || !input.value.trim()) { todasValidas = false; break; }

        const serie = input.value.trim();
        const encontrado = stock.find(item => item.serie1 === serie || item.serie2 === serie);
        if (!encontrado) { todasValidas = false; break; }
    }

    if (todasValidas) {
        mostrarCamposFinalesDevolucion('nmalos');
    }
}

// ─── 10. VERIFICAR COMPLETITUD REVERSA ──────────────────────
function verificarCompletitudReversa(cantidad) {
    let todasIngresadas = true;

    for (let i = 1; i <= cantidad; i++) {
        const input = document.getElementById(`serie-reversa-${i}`);
        if (!input || !input.value.trim()) { todasIngresadas = false; break; }
    }

    if (todasIngresadas) {
        mostrarCamposFinalesDevolucion('reversa');
    }
}

// ─── 11. MOSTRAR CAMPOS FINALES (fecha, guía, obs, botón) ───
function mostrarCamposFinalesDevolucion(tipo) {
    const hoy = new Date().toISOString().split('T')[0];

    // Fecha
    const grupoFecha = document.getElementById(`grupo-fecha-${tipo}`);
    const inputFecha = document.getElementById(`fecha-${tipo}`);
    if (grupoFecha) grupoFecha.style.display = 'block';
    if (inputFecha && !inputFecha.value) inputFecha.value = hoy;

    // Guía (solo reversa)
    if (tipo === 'reversa') {
        const grupoGuia = document.getElementById('grupo-guia-reversa');
        if (grupoGuia) grupoGuia.style.display = 'block';
    }

    // Observación
    const grupoObs = document.getElementById(`grupo-observacion-${tipo}`);
    if (grupoObs) grupoObs.style.display = 'block';

    // Botón registrar
    const btn = document.getElementById(`btn-registrar-${tipo}`);
    if (btn) {
        btn.disabled = false;
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ─── 12. REGISTRAR DEVOLUCIÓN ───────────────────────────────
async function registrarDevolucion(tipo) {
    const btnRegistrar = document.getElementById(`btn-registrar-${tipo}`);
    if (btnRegistrar) { btnRegistrar.disabled = true; btnRegistrar.textContent = '⏳ Registrando...'; }

    try {
        if (tipo === 'nmalos') {
            await registrarNmalos();
        } else {
            await registrarReversa();
        }
    } catch (err) {
        console.error('Error registrando devolución:', err);
        mostrarToast('❌ Error al registrar: ' + err.message, 'error');
        if (btnRegistrar) { btnRegistrar.disabled = false; btnRegistrar.textContent = tipo === 'nmalos' ? '✅ Registrar en Bodega Malos' : '✅ Registrar en Bodega Reversa'; }
    }
}

// ─── 12a. REGISTRAR NMALOS ──────────────────────────────────
async function registrarNmalos() {
    const cantidad = parseInt(document.getElementById('cantidad-nmalos').value);
    const tecnicoId = devolucionState.nmalos.tecnico;
    const fecha = document.getElementById('fecha-nmalos').value;
    const observacion = document.getElementById('observacion-nmalos').value;
    const stock = devolucionState.nmalos.stockEquipos;
    
    if (!fecha) { 
        mostrarToast('⚠️ Debe ingresar la fecha', 'warning'); 
        throw new Error('Falta fecha'); 
    }
    
    const registros = [];
    const seriesAEliminar = []; // ← NUEVO: Guardar series a eliminar
    
    for (let i = 1; i <= cantidad; i++) {
        const input = document.getElementById(`serie-nmalos-${i}`);
        const serie = input?.value?.trim();
        
        if (!serie) { 
        mostrarToast(`⚠️ Falta serie del equipo ${i}`, 'warning'); 
        throw new Error(`Falta serie ${i}`); 
        }
        
        const itemStock = stock.find(s => s.serie1 === serie || s.serie2 === serie);
        if (!itemStock) { 
        mostrarToast(`❌ Serie ${serie} no válida`, 'error'); 
        throw new Error(`Serie inválida: ${serie}`); 
        }
        
        registros.push({
        tecnico_id: tecnicoId,
        serie1: itemStock.serie1,
        serie2: itemStock.serie2 || null,
        articulo_codigo: itemStock.articuloCodigo,
        articulo_nombre: itemStock.articuloNombre || null,
        fecha_devolucion: fecha,
        observacion: observacion || null,
        tipo: 'nmalos',
        estado: 'Bodega Malo',           // ✅ Estado actual
        estado_gestion: 'pendiente',      // ✅ NUEVO: Para gestión de destino
        fecha_gestion: null,              // ✅ NUEVO: Fecha de decisión
        guia_devolucion: null,            // ✅ NUEVO: Guía si se devuelve
        observacion_destino: null         // ✅ NUEVO: Observación del destino
        });
        
        // ← NUEVO: Guardar serie para eliminar de asignaciones
        seriesAEliminar.push({
        serie1: itemStock.serie1,
        serie2: itemStock.serie2
        });
    }
    
    // 1. Insertar en bodega_malos
    const { error: errInsert } = await window.supabaseClient
        .from('bodega_malos')
        .insert(registros);
    
    if (errInsert) throw errInsert;
    
    // 2. ← NUEVO: Eliminar series de la tabla asignaciones
    const { data: asignacionesExistentes } = await window.supabaseClient
        .from('asignaciones')
        .select('*')
        .eq('tecnico_id', tecnicoId)
        .eq('tipo', 'equipo');
    
    if (asignacionesExistentes && asignacionesExistentes.length > 0) {
        for (const asignacion of asignacionesExistentes) {
        // Filtrar las series que NO están en la lista de eliminación
        const nuevasSeries = asignacion.series.filter(s => {
            const s1 = typeof s === 'object' ? s.serie1 : s;
            const s2 = typeof s === 'object' ? s.serie2 : '';
            
            // Verificar si esta serie está en la lista de eliminación
            const estaEnEliminacion = seriesAEliminar.some(e => 
            e.serie1 === s1 || (e.serie2 && e.serie2 === s2)
            );
            
            return !estaEnEliminacion; // Mantener solo las que NO se eliminan
        });
        
        // Actualizar o eliminar la asignación
        if (nuevasSeries.length === 0) {
            // Si no quedan series, eliminar toda la asignación
            await window.supabaseClient
            .from('asignaciones')
            .delete()
            .eq('id', asignacion.id);
        } else {
            // Si quedan series, actualizar el array
            await window.supabaseClient
            .from('asignaciones')
            .update({ series: nuevasSeries })
            .eq('id', asignacion.id);
        }
        }
    }
    
    // 3. ← NUEVO: Actualizar stock local en appData
    const tecnico = appData.empleados.find(e => e.id === tecnicoId);
    if (tecnico && tecnico.stock) {
        tecnico.stock.equipos = tecnico.stock.equipos.filter(eq => {
        return !seriesAEliminar.some(e => 
            e.serie1 === eq.serie1 || (e.serie2 && e.serie2 === eq.serie2)
        );
        });
    }
    
    await registrarBitacora(
            'devolucion_nmalos',
            `${registros.length} equipo(s) devuelto(s) como malos`,
            `Técnico ID: ${tecnicoId} | Fecha: ${fecha}`
        );

    mostrarToast(`✅ ${registros.length} equipo(s) registrado(s) en Bodega Malos y eliminados del stock`, 'success');
    
    // 4. ← NUEVO: Recargar datos para reflejar cambios
    await cargarDatos();
    
    resetFormulario('nmalos');
    document.getElementById('tipo-devolucion').value = '';
    document.getElementById('form-nmalos').style.display = 'none';
}

async function registrarReversa() {
    mostrarToast('Use el botón "Confirmar Recepción" en cada orden', 'info');
}

async function cambiarTipoDevolucion() {
    const tipo = document.getElementById('tipo-devolucion').value;
    
    // Ocultar ambos formularios y resetear estado
    document.getElementById('form-nmalos').style.display = 'none';
    document.getElementById('form-reversa').style.display = 'none';
    resetFormulario('nmalos');
    resetFormulario('reversa');

    if (tipo === 'nmalos') {
        document.getElementById('form-nmalos').style.display = 'block';
        await cargarTecnicosDevolucion('nmalos');
    } else if (tipo === 'reversa') {
        document.getElementById('form-reversa').style.display = 'block';
        await cargarTecnicosDevolucion('reversa');
    }
}

/**
 * Valida la serie ingresada (solo para Nmalos)
 */
function validarSerieDevolucion(prefijo, input) {
    const serie = input.value.trim();
    const tecnicoId = document.getElementById(`tecnico-nmalos`)?.value;
    const estadoSpan = input.parentElement?.querySelector('.estado-serie');
    
    if (!serie) {
        if (estadoSpan) estadoSpan.textContent = '';
        return;
    }
    
    // Validar que la serie esté en el stock del técnico
    const tecnico = appData.empleados.find(e => e.id === tecnicoId);
    const existe = tecnico?.stock?.equipos?.some(eq => eq.serie1 === serie);
    
    if (!existe) {
        if (estadoSpan) {
            estadoSpan.textContent = '❌ No está en stock';
            estadoSpan.style.color = '#dc3545';
        }
        input.value = '';
        mostrarToast(`❌ La serie "${serie}" no está en el stock del técnico`, 'error');
        input.focus();
        return;
    }
    
    // Verificar duplicados
    const inputs = document.querySelectorAll(`#inputs-series-nmalos .input-serie-devolucion`);
    const valores = Array.from(inputs).map(inp => inp.value.trim()).filter(v => v);
    const duplicados = valores.filter((v, i) => valores.indexOf(v) !== i);
    
    if (duplicados.includes(serie)) {
        if (estadoSpan) {
            estadoSpan.textContent = '⚠️ Duplicada';
            estadoSpan.style.color = '#ffc107';
        }
        input.value = '';
        mostrarToast(`⚠️ La serie "${serie}" ya fue ingresada`, 'warning');
        input.focus();
        return;
    }
    
    // ✅ Serie válida - obtener modelo
    const equipo = tecnico.stock.equipos.find(eq => eq.serie1 === serie);
    if (estadoSpan && equipo) {
        const articulo = appData.articulos.seriados.find(a => a.codigo === equipo.articuloCodigo);
        estadoSpan.textContent = `✅ ${articulo?.nombre || equipo.articuloCodigo}`;
        estadoSpan.style.color = '#28a745';
    }
}

/**
 * Verifica si todas las series están completas para mostrar siguientes campos
 */
function verificarCompletitudSeries(prefijo) {
    const tipo = prefijo === 'nmalos' ? 'nmalos' : 'reversa';
    const cantidad = parseInt(document.getElementById(`cantidad-${prefijo}`)?.value) || 0;
    const inputs = document.querySelectorAll(`#inputs-series-${prefijo} .input-serie-devolucion`);
    const btn = document.getElementById(`btn-registrar-${prefijo}`);
    
    if (inputs.length !== cantidad) {
        if (btn) btn.disabled = true;
        return;
    }
    
    const seriesCompletas = Array.from(inputs).every(inp => inp.value.trim() !== '');
    
    if (tipo === 'nmalos') {
        // Para Nmalos, verificar que todas sean válidas (tengan estado verde)
        const estados = document.querySelectorAll(`#inputs-series-nmalos .estado-serie`);
        const todasValidas = Array.from(estados).every(span => 
            span.textContent.includes('✅')
        );
        
        if (seriesCompletas && todasValidas) {
            document.getElementById(`grupo-fecha-nmalos`).style.display = 'block';
            document.getElementById(`grupo-observacion-nmalos`).style.display = 'block';
            document.getElementById('fecha-nmalos').value = new Date().toISOString().split('T')[0];
            document.getElementById('fecha-nmalos').focus();
            if (btn) btn.disabled = false;
        } else {
            if (btn) btn.disabled = true;
        }
    } else {
        // Para Reversa, solo verificar que estén completas
        if (seriesCompletas) {
            document.getElementById('grupo-guia-reversa').style.display = 'block';
            document.getElementById('guia-reversa').focus();
        } else {
            if (btn) btn.disabled = true;
        }
    }
}

/**
 * Valida el formulario completo para habilitar botón
 */

/**
 * Inicializa el panel cuando se muestra
 */
function inicializarPanelDevolucion() {
    document.getElementById('tipo-devolucion').value = '';
    document.getElementById('form-nmalos').style.display = 'none';
    document.getElementById('form-reversa').style.display = 'none';
}


function cargarEquiposTecnico(tipo) {
    if (tipo === 'nmalos') {
        const tecnicoId = document.getElementById('tecnico-nmalos').value;
        const inputCantidad = document.getElementById('cantidad-nmalos');
        if (tecnicoId) {
            inputCantidad.disabled = false;
            inputCantidad.value = '';
            document.getElementById('contenedor-series-nmalos').style.display = 'none';
            document.getElementById('btn-registrar-nmalos').disabled = true;
        } else {
            inputCantidad.disabled = true;
        }
    } else if (tipo === 'reversa') {
        const tecnicoId = document.getElementById('tecnico-reversa').value;
        const inputCantidad = document.getElementById('cantidad-reversa');
        inputCantidad.disabled = !tecnicoId;
        inputCantidad.value = '';
        document.getElementById('contenedor-series-reversa').style.display = 'none';
        // Ocultar campos posteriores al resetear técnico
        const grupoGuia = document.getElementById('grupo-guia-reversa');
        const grupoFecha = document.getElementById('grupo-fecha-reversa');
        if (grupoGuia) grupoGuia.style.display = 'none';
        if (grupoFecha) grupoFecha.style.display = 'none';
        document.getElementById('btn-registrar-reversa').disabled = true;
    }
}



// ============================================
// === MÓDULO DE REPORTES DE PRODUCCIÓN ===
// ============================================

function aplicarFiltrosReporte() {
    console.log('📊 Generando reporte de producción...');
    
    // Obtener valores de los filtros
    const fechaInicio = document.getElementById('filtro-reporte-inicio')?.value || '';
    const fechaFin = document.getElementById('filtro-reporte-fin')?.value || '';
    const tecnico = document.getElementById('filtro-reporte-tecnico')?.value || '';
    const servicio = document.getElementById('filtro-reporte-servicio')?.value || '';
    const estado = document.getElementById('filtro-reporte-estado')?.value || '';
    
    // ✅ SI NO HAY FECHAS SELECCIONADAS, USAR ÚLTIMOS 60 DÍAS POR DEFECTO
    if (!fechaInicio || !fechaFin) {
        const hoy = new Date();
        const hace60Dias = new Date();
        hace60Dias.setDate(hoy.getDate() - 60);
        
        fechaFin = hoy.toISOString().split('T')[0];
        fechaInicio = hace60Dias.toISOString().split('T')[0];
        
        // Actualizar los inputs visualmente
        if (document.getElementById('filtro-reporte-inicio')) {
            document.getElementById('filtro-reporte-inicio').value = fechaInicio;
        }
        if (document.getElementById('filtro-reporte-fin')) {
            document.getElementById('filtro-reporte-fin').value = fechaFin;
        }
        
        console.log(`📅 Filtro automático: Últimos 60 días (${fechaInicio} a ${fechaFin})`);
    }
    
    // Validar que haya órdenes cargadas
    if (!ordenes || ordenes.length === 0) {
        console.warn('⚠️ No hay órdenes cargadas en el sistema');
        mostrarToast("⚠️ No hay órdenes en el sistema para generar reportes.", "warning");
        const tabla = document.getElementById('tabla-reporte-produccion');
        if (tabla) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px; color: #dc3545;">
                        ⚠️ No hay órdenes cargadas en el sistema
                    </td>
                </tr>`;
        }
        // Limpiar estadísticas
        actualizarEstadisticasHeader([]);
        return;
    }
    
    // Filtrar órdenes según los criterios
    const inicio = document.getElementById('filtro-reporte-inicio')?.value || null;
    const fin = document.getElementById('filtro-reporte-fin')?.value || null;

    // Primero filtras por fecha (anti-bugs)
    let ordenesFiltradas = filtrarPorFecha(ordenes, inicio, fin);

    // Después aplicas los demás filtros
    ordenesFiltradas = ordenesFiltradas.filter(o => {

        if (tecnico && o.tecnico !== tecnico) return false;

        if (servicio && o.servicio !== servicio) return false;

        if (estado) {
            const estadoOrden = (o.estado || '').toLowerCase();
            const estadoFiltro = estado.toLowerCase();

            if (!estadoOrden.includes(estadoFiltro)) return false;
        }

        return true;
    });
    
    console.log(`✅ Órdenes filtradas: ${ordenesFiltradas.length} de ${ordenes.length}`);
    
    // Guardar datos para exportación
    window.datosReporteActual = ordenesFiltradas;
    
    // ✅ ACTUALIZAR ESTADÍSTICAS DEL HEADER
    actualizarEstadisticasHeader(ordenesFiltradas);
    
    // Generar el reporte
    generarReportePorTecnico(ordenesFiltradas);
    
    mostrarToast(`📊 Reporte generado: ${ordenesFiltradas.length} órdenes`, "success");
}

/**
* Genera reporte agrupado por técnico con totales y porcentajes
*/
function generarReportePorTecnico(ordenes) {
    console.log('📊 Generando reporte por técnico...');
    
    // Agrupar órdenes por técnico
    const tecnicoStats = {};
    
    ordenes.forEach(orden => {
        const tecnico = orden.tecnico || 'Sin asignar';
        if (!tecnicoStats[tecnico]) {
            tecnicoStats[tecnico] = {
                nombre: tecnico,
                ordenes: 0,
                agendadas: 0,
                liquidadas: 0,
                rechazadas: 0,
                puntajeTotal: 0
            };
        }
        tecnicoStats[tecnico].ordenes++;
        
        // Contar por estado (✅ CORREGIDO: aceptar AMBAS formas)
        const estado = (orden.estado || '').toLowerCase();
        if (estado.includes('agendada')) tecnicoStats[tecnico].agendadas++;
        if (estado.includes('liquidada')) tecnicoStats[tecnico].liquidadas++;
        if (estado.includes('rechazada')) tecnicoStats[tecnico].rechazadas++;
            const puntaje = orden.puntaje_liquidado || orden.puntaje || obtenerPuntajeSubservicio(orden.subservicio);
            tecnicoStats[tecnico].puntajeTotal += puntaje;
            
        if (estado.includes('rechazada')) tecnicoStats[tecnico].rechazadas++;
    });
    
    // Convertir a array y ordenar por cantidad de órdenes
    const tecnicos = Object.values(tecnicoStats).sort((a, b) => b.ordenes - a.ordenes);
    
    // Calcular total general
    const totalOrdenes = ordenes.length;
    
    console.log(`📊 Técnicos encontrados: ${tecnicos.length}`);
    
    // Renderizar tabla
    renderTablaReporte(tecnicos, totalOrdenes);
    
    // Renderizar gráfico
    renderGraficoReporte(tecnicos);
}

/**
* Renderiza la tabla de reporte con totales y porcentajes
*/
function renderTablaReporte(tecnicos, totalOrdenes) {
    const tabla = document.getElementById('tabla-reporte-produccion');
    if (!tabla) {
        console.error('❌ No se encontró la tabla #tabla-reporte-produccion');
        return;
    }
    
    if (!tecnicos || tecnicos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #666;">
                    📋 No hay datos para mostrar con los filtros seleccionados
                </td>
            </tr>`;
        return;
    }
    
    let html = '';
    
    // Filas de técnicos
    tecnicos.forEach(tec => {
        const porcentaje = totalOrdenes > 0 ? Math.round((tec.ordenes / totalOrdenes) * 100) : 0;
        html += `
            <tr>
                <td>${tec.nombre}</td>
                <td style="text-align: center;">${tec.ordenes}</td>
                <td style="text-align: center;">${porcentaje}%</td>
                <td style="text-align: center;">${tec.agendadas}</td>
                <td style="text-align: center;">${tec.liquidadas}</td>
                <td style="text-align: center;">${tec.rechazadas}</td>
                <td style="text-align: center;">${tec.puntajeTotal?.toFixed(2) || '0.00'}</td>
            </tr>`;
    });
    
    // Fila de total
    const totalAgendadas = tecnicos.reduce((sum, t) => sum + t.agendadas, 0);
    const totalLiquidadas = tecnicos.reduce((sum, t) => sum + t.liquidadas, 0);
    const totalRechazadas = tecnicos.reduce((sum, t) => sum + t.rechazadas, 0);
    
    html += `
        <tr style="background-color: #f0f0f0; font-weight: bold; border-top: 2px solid #333;">
            <td>Total general</td>
            <td style="text-align: center;">${totalOrdenes}</td>
            <td style="text-align: center;">100%</td>
            <td style="text-align: center;">${totalAgendadas}</td>
            <td style="text-align: center;">${totalLiquidadas}</td>
            <td style="text-align: center;">${totalRechazadas}</td>
        </tr>`;
    
    tabla.innerHTML = html;
}

/**
* Actualizar estadísticas del header (SOLO se llama al generar reporte)
*/
function actualizarEstadisticasHeader(ordenes) {
    const total = ordenes.length;
    const liquidadas = ordenes.filter(o => (o.estado || '').toLowerCase().includes('liquidada')).length;
    const rechazadas = ordenes.filter(o => (o.estado || '').toLowerCase().includes('rechazada')).length;
    const eficiencia = total > 0 ? Math.round((liquidadas / total) * 100) : 0;
    
    const statTotal = document.getElementById('stat-total-ordenes');
    const statLiquidadas = document.getElementById('stat-liquidadas');
    const statRechazadas = document.getElementById('stat-rechazadas');
    const statEficiencia = document.getElementById('stat-eficiencia');
    
    if (statTotal) statTotal.textContent = total;
    if (statLiquidadas) statLiquidadas.textContent = liquidadas;
    if (statRechazadas) statRechazadas.textContent = rechazadas;
    if (statEficiencia) statEficiencia.textContent = eficiencia + '%';
}

/**
* Limpia todos los filtros del reporte
*/
function limpiarFiltrosReporte() {
    const elInicio = document.getElementById('filtro-reporte-inicio');
    const elFin = document.getElementById('filtro-reporte-fin');
    const elTecnico = document.getElementById('filtro-reporte-tecnico');
    const elServicio = document.getElementById('filtro-reporte-servicio');
    const elEstado = document.getElementById('filtro-reporte-estado');
    
    if (elInicio) elInicio.value = '';
    if (elFin) elFin.value = '';
    if (elTecnico) elTecnico.selectedIndex = 0;
    if (elServicio) elServicio.selectedIndex = 0;
    if (elEstado) elEstado.selectedIndex = 0;
    
    // ✅ NO llamar a aplicarFiltrosReporte() automáticamente
    mostrarToast("✅ Filtros limpiados. Haz clic en 'Generar Reporte'.", "success");
}

/**
* Exporta el reporte a Excel
*/
function exportarReporteProduccion() {
    if (!window.datosReporteActual || window.datosReporteActual.length === 0) {
        return mostrarToast("❌ No hay datos para exportar. Genera un reporte primero.", "error");
    }
    
    // Preparar datos para Excel con columnas legibles
    const datosExcel = window.datosReporteActual.map(orden => ({
        'Número Orden': orden.numero || '—',
        'Fecha': orden.fecha || '—',
        'Técnico': orden.tecnico || '—',
        'Cliente': orden.nombre_cliente || '—',
        'RUT': orden.rut_cliente || '—',
        'Servicio': orden.servicio || '—',
        'Subservicio': orden.subservicio || '—',
        'Puntaje': orden.puntaje_liquidado || orden.puntaje || obtenerPuntajeSubservicio(orden.subservicio),
        'Estado': orden.estado || '—',
        'Región': orden.region || '—',
        'Comuna': orden.comuna || '—',
        'Dirección': orden.direccion || '—'
    }));
    
    // Crear libro Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    
    // Ajustar ancho de columnas para mejor legibilidad
    ws['!cols'] = [
        { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 25 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
        { wch: 20 }, { wch: 20 }, { wch: 30 }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Producción");
    
    // Nombre de archivo con fecha
    const hoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Reporte_Produccion_${hoy}.xlsx`);
    
    mostrarToast(`✅ Reporte exportado: ${datosExcel.length} registros`, "success");
}

/**
* Poblar los filtros de técnico y servicio al cargar el panel
*/
function poblarFiltrosReporte() {
    console.log('📊 Poblando filtros de reporte...');
    
    // === POBLAR TÉCNICOS ===
    const selectTecnico = document.getElementById('filtro-reporte-tecnico');
    if (selectTecnico && appData.empleados) {
        const tecnicos = appData.empleados
            .filter(emp => emp.activo && appData.cargos.some(c =>
                c.id === emp.cargoId && esCargoTecnico(c.nombre)
            ))
            .map(emp => ({
                value: `${emp.nombre1} ${emp.apepaterno}`,
                text: `${emp.nombre1} ${emp.apepaterno}`
            }))
            .sort((a, b) => a.text.localeCompare(b.text));
        
        selectTecnico.innerHTML = '<option value="">Todos los técnicos</option>';
        tecnicos.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.value;
            opt.textContent = t.text;
            selectTecnico.appendChild(opt);
        });
        console.log(`✅ ${tecnicos.length} técnicos cargados en filtro`);
    }
    
    // === POBLAR SERVICIOS ===
    const selectServicio = document.getElementById('filtro-reporte-servicio');
    if (selectServicio && appData.servicios) {
        selectServicio.innerHTML = '<option value="">Todos los servicios</option>';
        Object.keys(appData.servicios).forEach(servicio => {
            const opt = document.createElement('option');
            opt.value = servicio;
            opt.textContent = servicio;
            selectServicio.appendChild(opt);
        });
        console.log(`✅ ${Object.keys(appData.servicios).length} servicios cargados en filtro`);
    }
    
    // ✅ INICIALIZAR ESTADÍSTICAS EN 0
    actualizarEstadisticasHeader([]);
}

// HACER FUNCIONES GLOBALES (para los onclick del HTML)
window.aplicarFiltrosReporte = aplicarFiltrosReporte;
window.limpiarFiltrosReporte = limpiarFiltrosReporte;
window.exportarReporteProduccion = exportarReporteProduccion;
window.poblarFiltrosReporte = poblarFiltrosReporte;
window.actualizarEstadisticasHeader = actualizarEstadisticasHeader;


// === AGREGAR ORDENAMIENTO A LA TABLA ===

/**
* Renderiza gráfico mejorado con interactividad y estilo profesional
*/
function renderGraficoReporte(tecnicos) {
    const canvas = document.getElementById('grafico-reporte-produccion');
    if (!canvas) return;
    
    // Destruir gráfico anterior
    if (window.graficoReporteActual) {
        window.graficoReporteActual.destroy();
    }
    
    // Preparar datos
    const labels = tecnicos.map(t => t.nombre.length > 12 ? t.nombre.substring(0, 12) + '...' : t.nombre);
    
    const ctx = canvas.getContext('2d');
    
    // Gradientes para barras
    const gradientOrdenes = ctx.createLinearGradient(0, 0, 0, 400);
    gradientOrdenes.addColorStop(0, 'rgba(0, 51, 102, 0.9)');
    gradientOrdenes.addColorStop(1, 'rgba(0, 123, 255, 0.6)');
    
    const gradientLiquidadas = ctx.createLinearGradient(0, 0, 0, 400);
    gradientLiquidadas.addColorStop(0, 'rgba(40, 167, 69, 0.9)');
    gradientLiquidadas.addColorStop(1, 'rgba(75, 192, 192, 0.6)');
    
    const gradientRechazadas = ctx.createLinearGradient(0, 0, 0, 400);
    gradientRechazadas.addColorStop(0, 'rgba(220, 53, 69, 0.9)');
    gradientRechazadas.addColorStop(1, 'rgba(255, 99, 132, 0.6)');
    
    window.graficoReporteActual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Órdenes',
                    data: tecnicos.map(t => t.ordenes),
                    backgroundColor: gradientOrdenes,
                    borderColor: '#003366',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7
                },
                {
                    label: '✅ Liquidadas',
                    data: tecnicos.map(t => t.liquidadas),
                    backgroundColor: gradientLiquidadas,
                    borderColor: '#28a745',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7
                },
                {
                    label: '❌ Rechazadas',
                    data: tecnicos.map(t => t.rechazadas),
                    backgroundColor: gradientRechazadas,
                    borderColor: '#dc3545',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12, weight: '600' }
                    }
                },
                title: {
                    display: true,
                    text: '📊 Producción por Técnico',
                    font: { size: 16, weight: 'bold', family: 'Segoe UI' },
                    padding: { top: 10, bottom: 20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 51, 102, 0.95)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const total = tecnicos[context.dataIndex].ordenes;
                            const porcentaje = total > 0 ? Math.round((value/total)*100) : 0;
                            return `${label}: ${value} (${porcentaje}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5,
                        font: { size: 11 },
                        callback: function(value) { return value + ' órdenes'; }
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    ticks: {
                        font: { size: 11, weight: '500' },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            },
            onClick: (e, activeElements) => {
                // Interactividad: filtrar tabla al hacer clic en una barra
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    const tecnicoSeleccionado = tecnicos[index].nombre;
                    filtrarTablaPorTecnico(tecnicoSeleccionado);
                }
            }
        }
    });
}

// Función auxiliar para filtrar tabla desde el gráfico
function filtrarTablaPorTecnico(nombreTecnico) {
    const buscador = document.getElementById('buscador-tabla-reporte');
    if (buscador) {
        buscador.value = nombreTecnico;
        buscador.dispatchEvent(new Event('input'));
    }
}


// Animación suave para números


// HACER FUNCIONES GLOBALES (para los onclick del HTML)
window.aplicarFiltrosReporte = aplicarFiltrosReporte;
window.limpiarFiltrosReporte = limpiarFiltrosReporte;
window.exportarReporteProduccion = exportarReporteProduccion;
window.poblarFiltrosReporte = poblarFiltrosReporte;


/**
 * Elimina una serie asignada a un técnico, tanto del stock local como de Supabase.
 */
async function eliminarSerieAsignadaDirectamente() {
    const input = document.getElementById('eliminar-serie-input');
    const resultadoDiv = document.getElementById('resultado-eliminar-serie');
    if (!input || !resultadoDiv) return;

    const serie = input.value.trim();
    if (!serie) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ Ingrese un número de serie.</p>';
        return;
    }

    // Buscar en el stock local
    let tecnicoEncontrado = null;
    let tipoSerie = null;
    for (const emp of appData.empleados) {
        if (emp.stock?.equipos?.some(eq => eq.serie1 === serie || eq.serie2 === serie)) {
            tecnicoEncontrado = emp;
            tipoSerie = 'equipo';
            break;
        }
        if (emp.stock?.tarjetas?.some(t => t.serie === serie)) {
            tecnicoEncontrado = emp;
            tipoSerie = 'tarjeta';
            break;
        }
        if (emp.stock?.lnbs?.some(l => l.serie === serie)) {
            tecnicoEncontrado = emp;
            tipoSerie = 'lnb';
            break;
        }
    }

    if (!tecnicoEncontrado) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ La serie no está asignada a ningún técnico.</p>';
        return;
    }

    if (!confirm(`⚠️ ¿Eliminar la serie "${serie}" asignada a ${tecnicoEncontrado.nombre1} ${tecnicoEncontrado.apepaterno}?`)) {
        return;
    }

    try {
        // === 1. Eliminar de Supabase (tabla asignaciones) ===
        const { data: asignaciones } = await supabase
            .from('asignaciones')
            .select('*')
            .eq('tecnico_id', tecnicoEncontrado.id);

        let asignacionActualizada = false;
        for (const asig of (asignaciones || [])) {
            let nuevasSeries;
            if (tipoSerie === 'equipo') {
                nuevasSeries = asig.series.filter(eq => eq.serie1 !== serie && eq.serie2 !== serie);
            } else {
                nuevasSeries = asig.series.filter(item => item.serie !== serie);
            }

            if (nuevasSeries.length !== asig.series.length) {
                if (nuevasSeries.length === 0) {
                    await supabase.from('asignaciones').delete().eq('id', asig.id);
                } else {
                    await supabase.from('asignaciones').update({ series: nuevasSeries }).eq('id', asig.id);
                }
                asignacionActualizada = true;
                break;
            }
        }

        if (!asignacionActualizada) {
            throw new Error("No se encontró la serie en las asignaciones de Supabase.");
        }

        // === 2. Eliminar del stock local ===
        if (tipoSerie === 'equipo') {
            tecnicoEncontrado.stock.equipos = tecnicoEncontrado.stock.equipos
                .filter(eq => eq.serie1 !== serie && eq.serie2 !== serie);
        } else if (tipoSerie === 'tarjeta') {
            tecnicoEncontrado.stock.tarjetas = tecnicoEncontrado.stock.tarjetas
                .filter(t => t.serie !== serie);
        } else if (tipoSerie === 'lnb') {
            tecnicoEncontrado.stock.lnbs = tecnicoEncontrado.stock.lnbs
                .filter(l => l.serie !== serie);
        }

        // === 3. Registrar en bitácora ===
        // ✅ FIX: usamos tipoSerie (no tipoEncontrado que no existe aquí)
        // ✅ FIX: codigo_articulo viene del stock del técnico
        const codigoArticulo = tecnicoEncontrado.stock[
            tipoSerie === 'equipo' ? 'equipos' : tipoSerie === 'tarjeta' ? 'tarjetas' : 'lnbs'
        ]?.find(item =>
            tipoSerie === 'equipo'
                ? (item.serie1 === serie || item.serie2 === serie)
                : item.serie === serie
        )?.articuloCodigo || null;

        await registrarBitacora(
            'eliminacion_serie',
            `Serie ${serie} eliminada (asignada a ${tecnicoEncontrado.nombre1} ${tecnicoEncontrado.apepaterno})`,
            `Tipo: ${tipoSerie} | Artículo: ${codigoArticulo || '—'}`
        );

        resultadoDiv.innerHTML = `<p style="color:#28a745;">✅ Serie "${serie}" eliminada de Supabase y stock local.</p>`;
        input.value = '';

    } catch (err) {
        console.error("Error:", err);
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">❌ Error: ${err.message}</p>`;
    }
}

// === FUNCIÓN PARA ELIMINAR SERIE (DETECCIÓN AUTOMÁTICA) ===
async function eliminarSerieDelSistemaUI() {
    const input = document.getElementById('eliminar-serie-input');
    const resultadoDiv = document.getElementById('resultado-eliminar-serie');
    
    if (!input || !resultadoDiv) return;
    
    const serie = input.value.trim();
    if (!serie) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ Ingrese un número de serie.</p>';
        return;
    }
    
    resultadoDiv.innerHTML = '<p>🔍 Buscando serie en el sistema...</p>';
    
    // === DETECTAR TIPO DE SERIE ===
    let tipoEncontrado = null;
    
    // Buscar en equipos
    for (const ing of appData.ingresosSeriados || []) {
        const eq = (ing.equipos || []).find(e => e.serie1 === serie || e.serie2 === serie);
        if (eq) {
            tipoEncontrado = 'equipo';
            break;
        }
    }
    
    // Buscar en tarjetas
    if (!tipoEncontrado) {
        for (const ing of appData.ingresosTarjetas || []) {
            const t = (ing.tarjetas || []).find(tt => tt.serie === serie);
            if (t) {
                tipoEncontrado = 'tarjeta';
                break;
            }
        }
    }
    
    // Buscar en LNBs
    if (!tipoEncontrado) {
        for (const ing of appData.ingresosLNB || []) {
            const l = (ing.lnbs || []).find(ll => ll.serie === serie);
            if (l) {
                tipoEncontrado = 'lnb';
                break;
            }
        }
    }
    
    if (!tipoEncontrado) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ La serie no existe en el sistema.</p>';
        return;
    }
    
    // === LLAMAR A LA FUNCIÓN CORRECTA ===
    await eliminarSerieDelSistema(serie, tipoEncontrado);
}

// === ASIGNAR EVENTO AL BOTÓN ===
document.getElementById('btn-eliminar-serie-sistema')?.addEventListener('click', eliminarSerieDelSistemaUI);

// ============================================
// === EXPONER FUNCIONES AL SCOPE GLOBAL ===
// ============================================
window.cambiarTipoDevolucion = cambiarTipoDevolucion;
window.habilitarCantidad = habilitarCantidad;
window.cargarTecnicosDevolucion = cargarTecnicosDevolucion;
window.generarCamposSeriesDevolucion = generarCamposSeriesDevolucion;
window.validarSerieDevolucion = validarSerieDevolucion;
window.registrarDevolucion = registrarDevolucion;
window.confirmarReversaOrden = confirmarReversaOrden;
window.marcarEnProceso = marcarEnProceso;
window.cargarOrdenesReversaPendiente = cargarOrdenesReversaPendiente;
window.abrirEdicionEmpleado = abrirEdicionEmpleado;
window.editarEmpleado = abrirEdicionEmpleado; //
window.renderBitacora = renderBitacora;
window.limpiarFiltrosBitacora = limpiarFiltrosBitacora;


async function renderBitacora() {
    const contenedor = document.getElementById('bitacora-contenido');
    if (!contenedor) return;
    
    contenedor.innerHTML = '<p style="color:#888; padding:20px; text-align:center;">⏳ Cargando bitácora...</p>';
    
    try {
        const filtroTipo = document.getElementById('bitacora-filtro-tipo')?.value || '';
        const filtroUsuario = document.getElementById('bitacora-filtro-usuario')?.value.trim().toLowerCase() || '';
        const filtroDesde = document.getElementById('bitacora-filtro-desde')?.value || '';
        const filtroHasta = document.getElementById('bitacora-filtro-hasta')?.value || '';
        
        let query = supabase
            .from('bitacora')
            .select('*')
            .order('fecha_eliminacion', { ascending: false })
            .limit(500);
                    
        if (filtroTipo) {
            query = query.eq('observacion', filtroTipo);
        }
        
        if (filtroDesde) {
            query = query.gte('fecha_eliminacion', filtroDesde + 'T00:00:00');
        }
        
        if (filtroHasta) {
            query = query.lte('fecha_eliminacion', filtroHasta + 'T23:59:59');
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        let registros = data || [];
        
        // Filtrar por usuario si hay filtro
        if (filtroUsuario) {
            registros = registros.filter(r => 
                (r.usuario || '').toLowerCase().includes(filtroUsuario)
            );
        }
        
        if (registros.length === 0) {
            contenedor.innerHTML = '<p style="color:#888; padding:20px; text-align:center;">No se encontraron registros con los filtros aplicados.</p>';
            return;
        }
        
        // Mapeo de colores por tipo
        const colorTipo = (tipo) => {
            const mapa = {
                'asignacion':        { bg: '#dbeafe', color: '#1e40af', label: '📦 Asignación' },
                'ingreso_bodega':    { bg: '#dcfce7', color: '#166534', label: '📥 Ingreso Bodega' },
                'carga_masiva':      { bg: '#d1fae5', color: '#065f46', label: '📊 Carga Masiva' },
                'eliminacion_serie': { bg: '#fee2e2', color: '#991b1b', label: '🗑️ Eliminación Serie' },
                'eliminacion_orden': { bg: '#fce7f3', color: '#9d174d', label: '🗑️ Eliminación Orden' },
                'reversa_orden':     { bg: '#fef3c7', color: '#92400e', label: '🔄 Reversa Orden' },
                'transferencia':     { bg: '#ede9fe', color: '#5b21b6', label: '🔁 Transferencia' },     
                'reversa_equipo':    { bg: '#ffedd5', color: '#9a3412', label: '📦 Reversa Equipo' },    
                'devolucion_nmalos': { bg: '#fef9c3', color: '#854d0e', label: '⚠️ Devolución Malos' },
            };
            return mapa[tipo] || { bg: '#f3f4f6', color: '#374151', label: tipo || '—' };
        };
        
        let html = `
            <div style="margin-bottom:12px; color:#666; font-size:13px;">
                Mostrando <strong>${registros.length}</strong> registro(s)
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="background:#002244; color:white;">
                            <th style="padding:10px 12px; text-align:left;">Fecha y Hora</th>
                            <th style="padding:10px 12px; text-align:left;">Tipo</th>
                            <th style="padding:10px 12px; text-align:left;">Descripción</th>
                            <th style="padding:10px 12px; text-align:left;">Detalle</th>
                            <th style="padding:10px 12px; text-align:left;">Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        registros.forEach((r, i) => {
            const fecha = r.fecha_eliminacion 
                ? new Date(r.fecha_eliminacion).toLocaleString('es-CL', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                    timeZone: 'America/Santiago'
                })
                : '—';
            
            const tipo = r.observacion || r.tipo || '—';
            const { bg, color, label } = colorTipo(tipo);
            const fondo = i % 2 === 0 ? '#fff' : '#f9fafb';
            
            html += `
                <tr style="background:${fondo}; border-bottom:1px solid #e5e7eb;">
                    <td style="padding:10px 12px; white-space:nowrap; color:#555; font-size:12px;">${fecha}</td>
                    <td style="padding:10px 12px;">
                        <span style="background:${bg}; color:${color}; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; white-space:nowrap;">
                            ${label}
                        </span>
                    </td>
                    <td style="padding:10px 12px; color:#111;">${r.serie || '—'}</td>
                    <td style="padding:10px 12px; color:#555; font-size:12px;">${r.codigo_articulo || '—'}</td>
                    <td style="padding:10px 12px; color:#333; font-weight:600;">${r.usuario || '—'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
        contenedor.innerHTML = html;
        
    } catch (err) {
        console.error('Error cargando bitácora:', err);
        contenedor.innerHTML = `<p style="color:#dc3545; padding:20px;">❌ Error al cargar la bitácora: ${err.message}</p>`;
    }
}

function limpiarFiltrosBitacora() {
    ['bitacora-filtro-tipo', 'bitacora-filtro-usuario',
    'bitacora-filtro-desde', 'bitacora-filtro-hasta'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const contenedor = document.getElementById('bitacora-contenido');
    if (contenedor) contenedor.innerHTML = '<p style="color:#888; text-align:center; padding:30px;">Selecciona filtros y presiona Filtrar para ver los registros.</p>';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!sidebar || !overlay) return;
    
    const isActive = sidebar.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    
    // Cambiar ícono
    const btn = document.querySelector('.menu-toggle');
    if (btn) btn.textContent = isActive ? '✕' : '☰';
    
    console.log('Sidebar toggled → active:', isActive); // ← para debug
}

// Cerrar sidebar después de seleccionar una opción (solo en móviles)
function cerrarSidebarSiEsMovil() {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
        document.querySelector('.menu-toggle').innerHTML = '☰';
    }
}
