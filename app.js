// =======================================================
// --- CONFIGURACIÓN DE SUPABASE ---
// =======================================================
// Usar el cliente global inicializado en index.html (window.supabaseClient)
const supabase = window.supabaseClient;


// Agregar al inicio de app.js

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
    alert('⚠️ Error: No se pudo cargar la configuración de Supabase.\n\nVerifica config.js');
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
    servicios: {
        Instalacion: ["1 Deco", "2 Decos", "3 Decos", "4 Decos", "5 Decos"],
        VT: ["Visita Técnica", "Garantía", "Visita Movistar"],
        Adicional: ["Adicional 1 Deco", "Adicional 2 Decos", "Adicional 3 Decos", "Adicional 4 Decos"],
        Traslado: ["Traslado 1 Deco", "Traslado 2 Decos", "Traslado 3 Decos", "Traslado 4 Decos", "Traslado 5 Decos"],
        Regularizacion: ["Cambio Deco", "Agregar Otros"]
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

function esFechaFutura(fechaStr) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fechaIngreso = new Date(anio, mes - 1, dia);
    fechaIngreso.setHours(0, 0, 0, 0);
    return fechaIngreso >= hoy;
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

    // 2. Normalizamos rut que el usuario escribió (Quitamos puntos y guiones)
    const rutLimpio = normalizarRut(rutInput);

    // 3. Buscamos usuario comparando RUTs limpios
    const usuario = appData.usuarios?.find(u => {
    return normalizarRut(u.rut) === rutLimpio &&
    u.password === pass &&  // <--- CAMBIAR 'pass' POR 'password'
    u.activo !== false;
});

    if (!usuario) {
    // Verificar si existe pero está inactivo
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
    
    // 4. Reset de la Interfaz (UI)
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';

    // Limpiar menús activos anteriores
    document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));

    // 5. Filtrar módulos según el rol
    filtrarModulosPorRol(usuario.rol);

    // 6. Mostrar Panel de Bienvenida
    mostrarPanel('modulo-bienvenida');

    // --- 7. BLOQUE DE IMAGEN Y TEXTO FORZADO ---
    const imagenModulo = document.getElementById('imagen-modulo');
    const tituloModulo = document.getElementById('titulo-modulo');
    
    if (imagenModulo) {
        imagenModulo.src = 'instal.jpg';
        imagenModulo.style.opacity = '1';
    }
    if (tituloModulo) {
        tituloModulo.textContent = 'Bienvenido al módulo de servicios ARM';
        tituloModulo.style.opacity = '1';
    }

    mostrarToast(`Bienvenido, ${usuario.nombre}`, "success");
}

function filtrarModulosPorRol(rol) {
    const permisos = {
    'admin': ['dth', 'rrhh', 'gestion-orden', 'avance', 'logistica'],
    'rrhh': ['rrhh'],
    'despacho N1': ['dth'],
    'despacho N2': ['dth', 'logistica'],
    'logistica': ['logistica'],
    'lector': ['dth', 'logistica', 'avance']
    };

    const modulosPermitidos = permisos[rol] || [];

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

  // 👇 Activa automáticamente el PRIMER módulo visible
    const primerBotonVisible = document.querySelector('#main-nav button[data-module]:not([style*="display: none"])');
    if (primerBotonVisible) {
        // Quitar 'active' de todos
        document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
        // Activar este
        primerBotonVisible.classList.add('active');
        const moduloId = primerBotonVisible.dataset.module;
        seleccionarModulo(moduloId);
    }
}


function seleccionarModulo(moduloId) {
    if (timeoutBienvenida) {
        clearTimeout(timeoutBienvenida);
        timeoutBienvenida = null;
    }
    document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
    const botonActivo = document.querySelector(`#main-nav button[data-module="${moduloId}"]`);
    if (botonActivo) botonActivo.classList.add('active');
    document.querySelectorAll('#sidebar .submenu').forEach(s => s.classList.remove('active'));
    const submenuActivo = document.getElementById(`submenu-${moduloId}`);
    if (submenuActivo) submenuActivo.classList.add('active');
    mostrarPanel('modulo-bienvenida');
}

function mostrarPanel(panelId) {
    const usuario = window.usuarioActivo;

    // Verificar si hay sesión activa
    if (!usuario) {
        mostrarToast("🔒 Debe iniciar sesión para acceder.", "error");
        return;
    }

    // Definir qué módulos requiere cada panel
    const moduloPorPanel = {
        // RRHH
        'panel-gestion-cargos': 'rrhh',
        'panel-lista-personal': 'rrhh',
        'panel-nuevo-ingreso': 'rrhh',
        'panel-editar-empleado': 'rrhh',
        'panel-buscar-colaborador': 'rrhh',
        'panel-gestion-usuarios': 'rrhh',
        // DTH / Despacho
        'panel-ingreso-cliente': 'dth',
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
        'panel-gestion-bodega': 'logistica',
        'panel-saldo-tecnico': 'logistica',
        'panel-transferencia': 'logistica',
        'panel-asignacion-materiales': 'logistica',
        'panel-bodega-malos': 'logistica',
        'panel-bodega-reversa': 'logistica',
        // Reportes / Avance
        'reportes-produccion': 'avance',
        // Gestion orden
        'panel-gestion-orden': 'gestion-orden'
    };

    // ✅ OCULTAR PANEL DE REVERSAR ORDEN AL CAMBIAR DE MENÚ
    const panelReversarDespacho = document.getElementById('panel-reversar-orden-despacho');
    if (panelReversarDespacho) {
        panelReversarDespacho.style.display = 'none';
    }
    const moduloRequerido = moduloPorPanel[panelId];
    if (moduloRequerido) {
        // ✅ Mismos nombres que en la base de datos y en filtrarModulosPorRol
        const permisos = {
            'admin': ['dth', 'rrhh', 'gestion-orden', 'avance', 'logistica'],
            'rrhh': ['rrhh'],
            'despacho N1': ['dth'],
            'despacho N2': ['dth', 'logistica'],
            'logistica': ['logistica', 'dth'],
            'lector': ['dth', 'logistica', 'avance']
        };
        const modulosPermitidos = permisos[usuario.rol] || [];
        if (!modulosPermitidos.includes(moduloRequerido)) {
            mostrarToast("⚠️ No tienes permisos para acceder a esta sección.", "error");
            return;
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

    // Ejecutar lógica específica según el panel
    switch (panelId) {
        case 'panel-ingreso-cliente':
            resetFormularioOrden();
            break;
        case 'panel-devolucion-equipos':
        inicializarPanelDevolucion();
        break;

        case 'modulo-bienvenida':
            const moduloActivo = document.querySelector('#main-nav button.active')?.dataset.module;
            if (moduloActivo) {
                const imagenModulo = document.getElementById('imagen-modulo');
                const tituloModulo = document.getElementById('titulo-modulo');
                let imgSrc = '';
                let titulo = '';
                switch (moduloActivo) {
                    case 'dth':
                        imgSrc = 'instal.jpg';
                        titulo = 'Operaciones de Terreno';
                        break;
                    case 'rrhh':
                        imgSrc = 'instal.jpg';
                        titulo = 'Recursos Humanos';
                        break;
                    case 'avance':
                        imgSrc = 'instal.jpg';
                        titulo = 'Reportes y Análisis';
                        break;
                    case 'logistica':
                        imgSrc = 'instal.jpg';
                        titulo = 'Gestión Logística';
                        break;
                    case 'gestion-orden':
                        mostrarPanel('panel-gestion-orden');
                        break;
                    default:
                        imgSrc = 'instal.jpg';
                        titulo = 'Bienvenido a Tu Empresa';
                }
                if (imagenModulo) {
                    imagenModulo.src = imgSrc;
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
        break;
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
    }
}

// ============================================
// --- Lógica del Formulario de Ingreso DTH ---
// ============================================
function validarNumeroOrden() {
    const numeroInput = document.getElementById('orden-numero');
    const numero = numeroInput?.value.trim();
    if (!numero) return mostrarToast("Por favor, ingrese un número de orden.", "error");
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'block';
    const regionSelect = document.getElementById('orden-region');
    if (!regionSelect) {
        console.error("❌ No se encontró el select 'orden-region'");
        return;
    }
    regionSelect.disabled = false;
    populateSelect(regionSelect, Object.keys(appData.regiones).map(num => ({
        value: num,
        text: appData.regiones[num].nombre
    })), "Seleccione Región");
    regionSelect.value = '';
    console.log("✅ Regiones recargadas:", regionSelect.options.length, "opciones");
}

function validarCombinacion() {
    const numero = document.getElementById('orden-numero')?.value.trim();
    const regionId = document.getElementById('orden-region')?.value;
    if (!regionId) return mostrarToast("Seleccione una región.", "error");
    const sufijo = generarSufijoPorRegion(regionId);
    const numeroConSufijo = numero + sufijo;
    if (ordenes.some(o => o.numero === numeroConSufijo)) {
        return mostrarToast(`La orden ${numeroConSufijo} ya existe.`, "error");
    }
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('form-ingreso-orden').style.display = 'block';
    document.getElementById('orden-numero').value = numeroConSufijo;
    document.getElementById('orden-region').value = regionId;
    document.getElementById('orden-numero').disabled = true;
    document.getElementById('orden-region').disabled = true;
    const tituloIngreso = document.getElementById('titulo-ingreso-orden');
    if (tituloIngreso) {
        tituloIngreso.textContent = `Ingreso Orden: ${numeroConSufijo}`;
    }
    const comunaSelect = document.getElementById('orden-comuna');
    if (comunaSelect) {
        cargarComunas(comunaSelect, document.getElementById('orden-region'));
    }
    const servicioSelect = document.getElementById('orden-servicio');
    const subServicioSelect = document.getElementById('orden-sub');
    if (servicioSelect) {
        populateSelect(servicioSelect, Object.keys(appData.servicios).map(s => ({
            value: s,
            text: s
        })), "Seleccione Servicio");
        if (subServicioSelect) {
            subServicioSelect.innerHTML = '<option value="">-- Seleccione Subservicio --</option>';
        }
        servicioSelect.onchange = () => cargarSubServicio(subServicioSelect, servicioSelect);
    }
    actualizarPersonalDTH();
    document.getElementById('orden-rut')?.focus();
}

function validarRutChileno(rutCompleto) {
    const rutLimpio = rutCompleto.replace(/\./g, '');
    if (!/^[0-9]+-[0-9kK]{1}$/.test(rutLimpio)) return false;
    let [cuerpo, dv] = rutLimpio.split('-');
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * cuerpo.charAt(i);
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    dv = (dv.toLowerCase() === 'k') ?
    10 : parseInt(dv, 10);
    return dvEsperado === 11 ? dv === 0 : dvEsperado === 10 ?
    dv === 10 : dv === dvEsperado;
}

function validarRutInput(inputElement) {
    inputElement.classList.remove('valid', 'invalid');
    if (inputElement.value) {
        const esValido = validarRutChileno(inputElement.value);
        inputElement.classList.add(esValido ? 'valid' : 'invalid');
    }
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
        form.style.display = 'none';
    }
    document.getElementById('paso-1').style.display = 'block';
    document.getElementById('paso-2').style.display = 'none';
    const numInput = document.getElementById('orden-numero');
    if (numInput) {
        numInput.value = '';
        numInput.disabled = false;
    }
    const regionSelect = document.getElementById('orden-region');
    if (regionSelect) {
        regionSelect.value = '';
        regionSelect.disabled = false;
    }
    const comunaSelect = document.getElementById('orden-comuna');
    const subServicioSelect = document.getElementById('orden-sub');
    if (comunaSelect) comunaSelect.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
    if (subServicioSelect) subServicioSelect.innerHTML = '<option value="">-- Seleccione Subservicio --</option>';
    const rutInput = document.getElementById('orden-rut');
    if (rutInput) rutInput.classList.remove('valid', 'invalid');
}

async function guardarOrden(event) {
    event.preventDefault();
    const numero = document.getElementById('orden-numero')?.value.trim();
    const rutIngresado = document.getElementById('orden-rut')?.value.trim();
    const nombre = document.getElementById('orden-nombre')?.value.trim();
    const direccion = document.getElementById('orden-direccion')?.value.trim();
    const numero_contacto = document.getElementById('numero_contacto')?.value.trim();
    const regionSelect = document.getElementById('orden-region');
    const regionId = regionSelect?.value;
    const regionNombre = regionId ? appData.regiones[regionId]?.nombre : '';
    const comuna = document.getElementById('orden-comuna')?.value;
    const servicio = document.getElementById('orden-servicio')?.value;
    const subServicio = document.getElementById('orden-sub')?.value;
    const fecha = document.getElementById('orden-fecha')?.value;
    const tecnico = document.getElementById('orden-tecnico')?.value;
    const despacho = document.getElementById('orden-despacho')?.value;
    const observacion = document.getElementById('orden-observacion')?.value.trim();

    if (!numero || !rutIngresado || !nombre || !direccion || !regionId || !comuna || !servicio || !subServicio || !fecha || !despacho) {
        return mostrarToast("Todos los campos marcados son obligatorios (excepto Técnico).", "error");
    }

    if (!validarRutChileno(rutIngresado)) {
        return mostrarToast("RUT inválido.", "error");
    }

    const rut = normalizarRut(rutIngresado);

    if (!esFechaFutura(fecha)) {
        return mostrarToast("La fecha de ingreso debe ser hoy o futura.", "error");
    }

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
        tecnico,
        despacho,
        observacion,
        estado: 'Agendada',
        region: regionNombre
    };
    console.log("📦 Enviando a Supabase:", {
        ...nuevaOrden,
        numero_contacto: numero_contacto
    });

    try {
        // Verificar si la orden ya existe antes de insertar
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

        // ✅ Añadir a la memoria local (incluye el `id` de Supabase)
        ordenes.unshift(ordenGuardada);

        mostrarToast(`Orden N° ${numero} guardada con éxito.`, "success");
        resetFormularioOrden();
        mostrarPanel('panel-agendadas');
    } catch (err) {
        console.error("❌ Error al guardar en Supabase:", err);
        // Mostrar el error real de Supabase en pantalla
        const mensajeError = err?.message || err?.details || JSON.stringify(err);
        mostrarToast(`Error al guardar: ${mensajeError}`, "error");
    }

}

function formatearRutParaMostrar(rutNormalizado) {
    if (!rutNormalizado) return '';
    if (rutNormalizado.length < 2) return rutNormalizado;
    const cuerpo = rutNormalizado.slice(0, -1);
    const dv = rutNormalizado.slice(-1).toUpperCase();    
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoConPuntos}-${dv}`;
}

function abrirEdicionOrden(ordenId) {
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
    
    safeSetInputValue('editar-orden-rut', formatearRutParaMostrar(orden.rut_cliente || orden.rut || ''));
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
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No se encontraron órdenes agendadas.</td></tr>`;
        const paginacion = document.getElementById("paginacion");
        if (paginacion) paginacion.innerHTML = "";
        return;
    }
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const datosPaginados = datosParaMostrar.slice(inicio, fin);
    datosPaginados.forEach(o => {
        const tr = document.createElement("tr");
        tr.className = obtenerClasePorFecha(o.fecha); // 👈 Esta es la línea clave
        tr.innerHTML = `
        <td><button class="btn-link-orden" data-id="${o.id}">${o.numero}</button></td>
        <td>${o.fecha}</td>
        <td>${o.subservicio}</td>
        <td>${o.nombre_cliente}</td>
        <td>${o.rut_cliente}</td>
        <td>${o.direccion}</td>
        <td>${o.comuna}</td>
        <td>${o.tecnico}</td>
        <td>
        <div class="dropdown">
        <button class="btn-estado">🔄 Estado</button>
        <div class="dropdown-content">
        <button class="btn-liquidar" data-id="${o.id}">✅ Liquidar</button>
        <button class="btn-rechazar" data-id="${o.id}">❌ Rechazar</button>
        </div>
        </div>
        </td>
        `;
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-link-orden').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            abrirEdicionOrden(btn.dataset.id);
        });
    });
    tbody.querySelectorAll('.btn-liquidar').forEach(btn => {
        btn.addEventListener('click', () => {
            const ordenId = btn.dataset.id;
            abrirModalLiquidacion(ordenId);
        });
    });
    tbody.querySelectorAll('.btn-rechazar').forEach(btn => {
        btn.addEventListener('click', () => abrirMotivoRechazo(btn.dataset.id));
    });
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
    const tecnico = appData.empleados.find(emp => `${emp.nombre1} ${emp.apepaterno}` === tecnicoFiltrado && emp.activo);
    if (!tecnico || !tecnico.telefono) return mostrarToast(`No se encontró teléfono para el técnico ${tecnicoFiltrado}.`, "error");

    let numero = tecnico.telefono.replace(/\D/g, '');
    if (numero.length === 9 && numero.startsWith('9')) {
        numero = '56' + numero;
    }

    const filas = document.querySelectorAll("#tabla-agendadas tbody tr");
    if (filas.length === 0 || filas[0].children.length < 2)
        return mostrarToast("No hay órdenes para enviar.", "error");

    let mensaje = `Hola ${tecnico.nombre1}, tienes las siguientes órdenes:
`;
    filas.forEach(fila => {
        const numeroOrden = fila.children[0].textContent;
        const fecha = fila.children[1].textContent;
        const subservicio = fila.children[2].textContent;
        const cliente = fila.children[3].textContent;
        const direccion = fila.children[5].textContent;
        const comuna = fila.children[6].textContent;

        // ✅ Buscar la orden completa para obtener la observación
        const orden = ordenes.find(o => o.numero === numeroOrden);
        const observacion = orden?.observacion ? `Observación: ${orden.observacion}` : '';

        mensaje += `• Orden #${numeroOrden}
Fecha: ${fecha}
Servicio: ${orden?.servicio || '—'}
Subservicio: ${subservicio}
Cliente: ${cliente}
Dirección: ${direccion}
Comuna: ${comuna}
${observacion ? `\n${observacion}` : ''}
`;
    });
    mensaje += "¡Éxito en el terreno!";

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

    resultadoDiv.innerHTML = ''; // ✅ LIMPIAR ANTES DE BUSCAR

    const numeroOrden = input.value.trim();
    if (!numeroOrden) return mostrarToast("Ingrese un número de orden.", "error");
    const orden = ordenes.find(o => o.numero === numeroOrden);
    if (!orden) {
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">Orden no encontrada.</p>`;
        return;
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

    let html = `
    <div style="background:#f8f9fa; padding:16px; border-radius:10px; margin-top:12px; border-left:4px solid #28a745;">
        <h3>🔍 Detalle de la Orden #${orden.numero}</h3>
        <p><strong>RUT:</strong> ${formatearRutParaMostrar(orden.rut_cliente)}</p>
        <p><strong>Número de Orden:</strong> ${orden.numero}</p>
        <p><strong>Titular:</strong> ${orden.nombre_cliente}</p>
        <p><strong>Teléfono de contacto:</strong> ${orden.numero_contacto || '—'}</p>
        <p><strong>Persona que recibe:</strong> ${orden.nombre_recibe || orden.nombreRecibe || '—'}</p>
        <p><strong>Teléfono recibe:</strong> ${orden.telefono_contacto || orden.telefonoContacto || '—'}</p>
        <p><strong>Estado:</strong> ${orden.estado || '—'}</p>
        <p><strong>Fecha:</strong> ${orden.fecha}</p>
        <p><strong>Técnico:</strong> ${orden.tecnico || '—'}</p>
        <p><strong>Despacho:</strong> ${orden.despacho || '—'}</p>
        <p><strong>Servicio:</strong> ${orden.servicio || '—'} → ${orden.subservicio || '—'}</p>
    `;

    // ✅ Mostrar coordenadas SI EXISTEN (de cualquier forma)
    const coord = orden.coordenadas || orden.coord || orden.Coordenadas || '';
    if (coord) {
        html += `<p><strong>Coordenadas:</strong> ${coord}</p>`;
    }

    // ✅ Equipos entrantes
    const seriesEntrada = asegurarArray(orden.series_entrada);
    html += `<p><strong>Decos entrantes:</strong> ${seriesEntrada.length ? seriesEntrada.join(', ') : '—'}</p>`;

    // ✅ Tarjetas entrantes
    const seriesTarjetas = asegurarArray(orden.series_tarjetas);
    html += `<p><strong>Tarjetas entrantes:</strong> ${seriesTarjetas.length ? seriesTarjetas.join(', ') : '—'}</p>`;

    // ✅ LNB entrantes
    const seriesLNB = asegurarArray(orden.series_lnb);
    html += `<p><strong>LNB entrantes:</strong> ${seriesLNB.length ? seriesLNB.join(', ') : '—'}</p>`;

    // Equipos retirados
    const seriesSalida = asegurarArray(orden.series_salida);
    if (seriesSalida.length > 0) {
        html += `<p><strong>Equipos retirados:</strong> ${seriesSalida.join(', ')}</p>`;
    }

    // Observaciones
    if (orden.observacion) html += `<p><strong>Observación:</strong> ${orden.observacion}</p>`;
    if (orden.observacion_liquidacion) {
        html += `<p><strong>Observación de liquidación:</strong> ${orden.observacion_liquidacion}</p>`;
    }
    if (orden.estado === 'Rechazada' && orden.motivo_rechazo) {
        html += `<p><strong>Motivo rechazo:</strong> ${orden.motivo_rechazo} — ${orden.observacion_rechazo || ''}</p>`;
    }

    html += `</div>`;
    resultadoDiv.innerHTML = html;
}

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

  // ✅ Función auxiliar para manejar series de forma segura
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

    let html = `<h3>Órdenes encontradas (${ordenesFiltradas.length})</h3>`;
    ordenesFiltradas.forEach(orden => {
        html += `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #007bff;">
        <p><strong>Orden:</strong> ${orden.numero}</p>
        <p><strong>Cliente:</strong> ${orden.nombre_cliente || orden.nombre || '—'}</p>
        <p><strong>RUT:</strong> ${orden.rut_cliente}</p>
        <p><strong>Servicio:</strong> ${orden.servicio || '—'}</p>
        <p><strong>Subservicio:</strong> ${orden.subservicio || orden.subServicio || '—'}</p>
        <p><strong>Estado:</strong> <span class="estado-btn estado-${orden.estado?.toLowerCase()}">${orden.estado || 'Sin estado'}</span></p>
    `;

    // Campos de liquidación (si existen)
    const nombreRecibe = orden.nombre_recibe || orden.nombreRecibe || '—';
    const telefonoContacto = orden.telefono_contacto || orden.telefonoContacto || '—';
    const observacion = orden.observacion_liquidacion || orden.observacionLiquidacion || '—';

    if (orden.estado === 'Liquidadas') {
      // ✅ Equipos, tarjetas y LNB con protección
        const seriesEntrada = asegurarArray(orden.series_entrada).join(', ') || '—';
        const seriesTarjetas = asegurarArray(orden.series_tarjetas).join(', ') || '—';
        const seriesLNB = asegurarArray(orden.series_lnb).join(', ') || '—';

    // ✅ Equipos retirados
    if (orden.series_salida?.length > 0) {
    html += `<p><strong>Equipos retirados:</strong> ${orden.series_salida.join(', ')}</p>`;
    }

    html += `
        <p><strong>Decos entrantes:</strong> ${seriesEntrada}</p>
        <p><strong>Tarjetas entrantes:</strong> ${seriesTarjetas}</p>
        <p><strong>LNB entrantes:</strong> ${seriesLNB}</p>
        <p><strong>Nombre que recibe:</strong> ${nombreRecibe}</p>
        <p><strong>Teléfono de contacto:</strong> ${telefonoContacto}</p>
        <p><strong>Observación:</strong> ${observacion}</p>
        `;
    }

    html += `</div>`;
    });

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
                actualizarPersonalDTH();
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

// ============================================
// --- Edición de Empleados ---
// ============================================
function abrirEdicionEmpleado(empleadoId) {
    const empleado = appData.empleados.find(e => e.id === empleadoId);
    if (!empleado) return mostrarToast("Empleado no encontrado.", "error");

    // Llenar campos básicos
    document.getElementById('editar-empleado-id').value = empleado.id;
    document.getElementById('editar-nombre1').value = empleado.nombre1;
    document.getElementById('editar-nombre2').value = empleado.nombre2 || '';
    document.getElementById('editar-apepaterno').value = empleado.apepaterno;
    document.getElementById('editar-apematerno').value = empleado.apematerno;
    document.getElementById('editar-rut').value = empleado.rut;
    document.getElementById('editar-telefono').value = empleado.telefono || '';
    document.getElementById('editar-direccion').value = empleado.direccion || '';
    document.getElementById('editar-email').value = empleado.email || '';
    document.getElementById('editar-fecha-nac').value = empleado.fechaNacimiento;
    document.getElementById('editar-fecha-ingreso').value = empleado.fechaIngreso;
    document.getElementById('editar-observacion').value = empleado.observacion || '';

    // Cargar cargo (select)
    populateSelect(document.getElementById('editar-cargo'), 
        appData.cargos.map(c => ({ value: c.id, text: c.nombre })), 
        "Seleccione Cargo"
    );
    document.getElementById('editar-cargo').value = empleado.cargoId;

    // ✅ REGION Y COMUNA → TEXTO LIBRE (NO SELECT)
    document.getElementById('editar-region').value = empleado.region || '';
    document.getElementById('editar-comuna').value = empleado.comuna || '';

    // Licencia (solo técnicos)
    const grupoLicenciaEdit = document.getElementById('grupo-licencia-tecnico-edit');
    const fechaLicenciaEdit = document.getElementById('editar-fecha-vencimiento-licencia');
    const esTecnico = appData.cargos.some(c => 
        c.id === empleado.cargoId && 
        c.nombre.toLowerCase().includes('tecnico')
    );

    if (esTecnico && empleado.fechaVencimientoLicencia) {
        grupoLicenciaEdit.style.display = 'block';
        fechaLicenciaEdit.value = empleado.fechaVencimientoLicencia;
    } else {
        grupoLicenciaEdit.style.display = 'none';
        fechaLicenciaEdit.value = '';
    }

    mostrarPanel('panel-editar-empleado');
}

async function guardarEdicionEmpleado(event) {
    event.preventDefault();

    const id = document.getElementById('editar-empleado-id')?.value;
    if (!id) return mostrarToast("Error: ID no válido.", "error");

    const rut = document.getElementById('editar-rut')?.value.trim();
    if (!rut || !validarRutChileno(rut)) {
        return mostrarToast("RUT inválido.", "error");
    }

    // Evitar duplicados de RUT (excepto el propio)
    if (appData.empleados.some(e => e.rut === rut && e.id !== id)) {
        return mostrarToast("El RUT ya está registrado en otro colaborador.", "error");
    }

    const index = appData.empleados.findIndex(e => e.id === id);
    if (index === -1) return mostrarToast("Colaborador no encontrado.", "error");

    // Capturar datos
    const nombre1 = document.getElementById('editar-nombre1')?.value.trim() || '';
    const nombre2 = document.getElementById('editar-nombre2')?.value.trim() || '';
    const apepaterno = document.getElementById('editar-apepaterno')?.value.trim() || '';
    const apematerno = document.getElementById('editar-apematerno')?.value.trim() || '';
    const telefono = document.getElementById('editar-telefono')?.value.trim() || '';
    const direccion = document.getElementById('editar-direccion')?.value.trim() || '';
    const email = document.getElementById('editar-email')?.value.trim() || '';
    const observacion = document.getElementById('editar-observacion')?.value.trim() || '';
    const fechaNac = document.getElementById('editar-fecha-nac')?.value || appData.empleados[index].fechaNacimiento;
    const fechaIngreso = document.getElementById('editar-fecha-ingreso')?.value || appData.empleados[index].fechaIngreso;
    const cargoId = document.getElementById('editar-cargo')?.value;

    if (!nombre1 || !apepaterno || !apematerno || !cargoId) {
        return mostrarToast("Complete todos los campos obligatorios.", "error");
    }

    // ✅ REGION Y COMUNA → TEXTO LIBRE
    const regionEmpleado = document.getElementById('editar-region')?.value.trim() || '';
    const comunaEmpleado = document.getElementById('editar-comuna')?.value.trim() || '';

    // Licencia (solo técnicos)
    const esTecnico = appData.cargos.some(c => 
        c.id === cargoId && 
        c.nombre.toLowerCase().includes('tecnico')
    );

    let fechaVencimientoLicencia = null;
    if (esTecnico) {
        fechaVencimientoLicencia = document.getElementById('editar-fecha-vencimiento-licencia')?.value;
        if (!fechaVencimientoLicencia) {
            return mostrarToast("Debe ingresar la fecha de vencimiento de la licencia de conducir.", "error");
        }
    }

    // Actualizar en memoria local
    appData.empleados[index] = {
        ...appData.empleados[index],
        nombre1,
        nombre2,
        apepaterno,
        apematerno,
        rut,
        telefono,
        direccion,
        region: regionEmpleado,       // ✅ Texto libre
        comuna: comunaEmpleado,       // ✅ Texto libre
        email,
        cargoId,
        fechaNacimiento: fechaNac,
        fechaIngreso: fechaIngreso,
        observacion,
        fechaVencimientoLicencia
    };

    // Guardar en Supabase
    try {
        const { error } = await supabase
            .from('empleados')
            .update({
                nombre1,
                nombre2,
                apepaterno,
                apematerno,
                rut,
                telefono,
                direccion,
                region: regionEmpleado,       // ✅
                comuna: comunaEmpleado,       // ✅
                email,
                cargo: cargoId,
                fecha_nacimiento: fechaNac,
                fecha_ingreso: fechaIngreso,
                observacion,
                fecha_vencimiento_licencia: fechaVencimientoLicencia
            })
            .eq('id', id);

        if (error) throw error;

        mostrarToast("Colaborador actualizado con éxito.", "success");
        mostrarPanel('panel-lista-personal');
        if (typeof renderTablaPersonal === 'function') {
            renderTablaPersonal();
        }
    } catch (err) {
        console.error("❌ Error al actualizar en Supabase:", err);
        mostrarToast("Error al guardar los cambios en la nube.", "error");
    }
}

// ============================================
// --- Lógica de Cambio de Estado de Órdenes ---
// ============================================

function abrirMotivoRechazo(ordenId) {
    const modal = document.createElement('div');
    modal.id = 'modal-rechazo';
    modal.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
z-index: 2000;`;
    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 350px; width: 90%;">
            <h3 style="margin-top: 0; text-align: center;">Motivo de Rechazo</h3>
            <div id="motivos-container" style="display: flex; flex-direction: column; gap: 8px; margin: 15px 0;">
                ${TIPOS_RECHAZO.map(motivo => `<button type="button" data-motivo="${motivo}" style="background: #f8f9fa; border: 1px solid #ddd; padding: 10px; border-radius: 6px; text-align: left; cursor: pointer; font-size: 14px; transition: all 0.2s;">${motivo}</button>`).join('')}
            </div>
            <div>
                <label for="observacion-rechazo" style="display: block; margin-bottom: 6px; font-weight: 600;">Observación (mínimo 5 caracteres):</label>
                <textarea id="observacion-rechazo" placeholder="Ej: Cliente no estaba en casa..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; min-height: 60px;"></textarea>
                <div id="error-observacion"style="color: #dc3545; font-size: 0.85em; margin-top: 5px; display: none;">La observación es obligatoria.</div>
            </div>
            <div style="text-align: right; margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" id="btnCancelarRechazo" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Cancelar</button>
                <button type="button" id="btnAceptarRechazo" disabled style="background: #ccc; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: not-allowed;">Aceptar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Capturar elementos
    const btnCancelar = document.getElementById('btnCancelarRechazo');
    const btnAceptar = document.getElementById('btnAceptarRechazo');
    const motivosContainer = document.getElementById('motivos-container');
    const obsTextarea = document.getElementById('observacion-rechazo');

    // Variables locales para almacenar la selección
    let motivoSeleccionado = null;

    // Evento para cerrar el modal
    if (btnCancelar) btnCancelar.addEventListener('click', () => {
        modal.remove();
    });

    // Evento para seleccionar motivo
    if (motivosContainer) {
        motivosContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                motivoSeleccionado = e.target.dataset.motivo;
                // Resaltar botón seleccionado
                document.querySelectorAll('#motivos-container button').forEach(btn => {
                    btn.style.background = btn === e.target ? '#007bff' : '#f8f9fa';
                    btn.style.color = btn === e.target ? 'white' : 'black';
                });
                validarObservacionRechazo(); // Actualizar estado del botón Aceptar
            }
        });
    }

    // Validar observación en tiempo real
    if (obsTextarea) {
        obsTextarea.addEventListener('input', validarObservacionRechazo);
    }

    // Función para validar si el botón "Aceptar" puede ser habilitado
    function validarObservacionRechazo() {
        const observacion = obsTextarea?.value.trim() || '';
        if (!btnAceptar) return;
        // Habilitar solo si hay motivo seleccionado y observación válida
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

    // Evento para guardar el rechazo
    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            // Verificar que ambos campos estén completos
            if (!motivoSeleccionado) {
                mostrarToast("Por favor, seleccione un motivo.", "error");
                return;
            }
            const observacion = obsTextarea?.value.trim() || '';
            if (observacion.length < 5) {
                mostrarToast("La observación debe tener al menos 5 caracteres.", "error");
                return;
            }
            // Llamar a la función de guardado con los valores correctos
            guardarRechazo(ordenId, motivoSeleccionado, observacion);
            modal.remove(); // Cerrar el modal
        });
    }
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

        // ✅ OBTENER FECHAS DEL FILTRO
        const inicio = document.getElementById('filtro-liquida-inicio')?.value;
        const fin = document.getElementById('filtro-liquida-fin')?.value;
        
        // ✅ SI NO HAY FECHAS SELECCIONADAS, MOSTRAR MENSAJE Y NO CARGAR DATOS
        if (!inicio || !fin) {
            tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;color:#6c757d;font-size:16px;">
                    <i class="fas fa-calendar-alt" style="font-size:2em;margin-bottom:10px;"></i><br>
                    Seleccione un rango de fechas para ver las órdenes liquidadas
                </td>
            </tr>`;
            
            totalSpan.textContent = '0';
            
            // ✅ Ocultar resumen si no hay fechas
            if (resumenDiv) {
                resumenDiv.innerHTML = `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <p style="color: #6c757d; margin: 0;">Seleccione un rango de fechas para ver el resumen</p>
                </div>`;
            }
            
            return; // ✅ SALIR SIN PROCESAR NADA
        }
        
        // ✅ SI HAY FECHAS, FILTRAR Y MOSTRAR DATOS
        let liquidadas = ordenes.filter(o => o.estado === 'Liquidadas');
        
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);
        
        liquidadas = liquidadas.filter(o => {
            const fechaOrden = new Date(o.fecha);
            return !isNaN(fechaOrden.getTime()) &&
                fechaOrden >= fechaInicio &&
                fechaOrden <= fechaFin;
        });
        
        // ✅ CONTAR TIPOS DE SERVICIOS (SOLO SI HAY DATOS)
        let conteoServicios = { INST: 0, VT: 0, UP: 0, TRAS: 0, otros: 0 };
        liquidadas.forEach(o => {
            const servicio = (o.servicio || '').toUpperCase();
            if (servicio.includes('INSTALACION') || servicio.includes('INST')) conteoServicios.INST++;
            else if (servicio.includes('VISITA') || servicio.includes('VT')) conteoServicios.VT++;
            else if (servicio.includes('UPGRADE') || servicio.includes('UP')) conteoServicios.UP++;
            else if (servicio.includes('TRASLADO') || servicio.includes('TRAS')) conteoServicios.TRAS++;
            else conteoServicios.otros++;
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
                <td>${o.tecnico || '—'}</td>
                <td>${o.servicio || '—'}</td>
                <td>${o.ferreteria?.conectores || '0'} conn, ${o.ferreteria?.cable || '0'}m</td>
            </tr>`;
        });
        
        tbody.innerHTML = html || `
        <tr>
            <td colspan="7" style="text-align:center;padding:20px;color:#6c757d">
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
    const tbody = document.querySelector("#tabla-rechazadas tbody");
    if (!tbody) return;

  // ✅ Motivos permitidos (solo estos se mostrarán)
    const motivosPermitidos = ["Sin moradores", "Orden mal generada", "Cliente rechaza"];

  // 1. Obtener fechas del filtro
    const inicio = document.getElementById('filtro-rechazo-inicio')?.value;
    const fin = document.getElementById('filtro-rechazo-fin')?.value;

  // 2. Filtrar órdenes rechazadas en rango de fechas Y con motivo permitido
    let rechazadas = [];
    if (inicio && fin) {
        rechazadas = ordenes.filter(o =>
        o.estado === "Rechazada" &&
        o.fecha >= inicio &&
        o.fecha <= fin &&
        motivosPermitidos.includes(o.motivo_rechazo || o.motivoRechazo || '')
        );
    }

  // 3. Limpiar tabla
    tbody.innerHTML = "";
    if (!inicio || !fin) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Seleccione un rango de fechas para ver las órdenes rechazadas.</td></tr>`;
        return;
    }
    if (rechazadas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay órdenes rechazadas en el rango seleccionado.</td></tr>`;
        return;
    }

  // 4. Renderizar filas
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

  // 6. Conectar botones para reversar
    document.querySelectorAll('#panel-rechazadas .btn-link-orden').forEach(btn => {
        btn.addEventListener('click', (e) => {
        e.preventDefault();
        const numero = btn.dataset.numero;
        reversarOrdenPorNumero(numero);
        });
    });
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
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
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
function actualizarPersonalDTH() {
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
    if(despachoSelect) populateSelect(despachoSelect, appData.personal.despacho.map(d => ({ value: d, text: d })), "Seleccione Despacho");
    if(tecnicoSelect) populateSelect(tecnicoSelect, appData.personal.tecnicos.map(t => ({ value: t, text: t })), "Seleccione Técnico");
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

    // --- Cargar órdenes (paginado para superar límite de 1000) ---
    try {
        let todasLasOrdenes = [];
        let desde = 0;
        const tamañoPagina = 1000;
        let hayMas = true;

        while (hayMas) {
            const { data, error } = await supabase
                .from('ordenes')
                .select('*')
                .range(desde, desde + tamañoPagina - 1)
                .order('fecha', { ascending: false });

            if (error) throw error;

            todasLasOrdenes = todasLasOrdenes.concat(data);
            hayMas = data.length === tamañoPagina;
            desde += tamañoPagina;
        }

        ordenes = todasLasOrdenes.map(o => ({
            ...o,
            rut: o.rut_cliente,
            nombre: o.nombre_cliente,
            nombreRecibe: o.nombre_recibe || o.persona_recibe || '',
            telefonoContacto: o.telefono_contacto || '',
            coordenadas: o.coordenadas || ''
        }));
        console.log(`✅ ${ordenes.length} órdenes cargadas (paginado).`);
    } catch (err) {
        console.error("❌ Error al cargar órdenes:", err);
        ordenes = [];
    }
    document.getElementById('btn-salir')?.addEventListener('click', cerrarSesion);

    // Actualizar listas de personal
    actualizarPersonalDTH();
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

    // Combinar todos los artículos por tipo
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
                        data-id="${art.id}" 
                        data-tipo="${art.tipo.toLowerCase()}"
                        style="background:orange; color:black; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.9em; margin-right:5px;">
                    ✏️ Editar
                </button>
                <button class="btn-eliminar-articulo" 
                        data-id="${art.id}" 
                        data-tipo="${art.tipo.toLowerCase()}"
                        style="background:#dc3545; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.9em;">
                    ❌ Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}


// Interceptamos el submit para detectar si es edición
document.getElementById('form-crear-articulo')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editando = this.dataset.editando;
    if (editando) {
        // --- Modo Edición ---
        const origen = this.dataset.origen;
        const codigo = editando;
        const nuevoNombre = document.getElementById('articulo-nombre').value.trim();
        if (!nuevoNombre) return mostrarToast("El nombre no puede estar vacío.", "error");
        
        const lista = appData.articulos[origen];
        const index = lista.findIndex(a => a.codigo === codigo);
        if (index !== -1) {
            lista[index].nombre = nuevoNombre;

            // ✅ Mapear origen a tipo de Supabase
            const tipoMap = { 
                'seriados': 'equipo', 
                'ferreteria': 'tarjeta', 
                'lnbs': 'lnb' 
            };
            const tipoSupabase = tipoMap[origen];

            // ✅ Usar UPDATE, no INSERT
            const { error } = await supabase
                .from('articulos')
                .update({ nombre: nuevoNombre })
                .eq('codigo', codigo)
                .eq('tipo', tipoSupabase);

            if (error) {
                console.error("Error al actualizar:", error);
                mostrarToast("Error al guardar en la nube.", "error");
                return;
            }

            mostrarToast("✅ Artículo actualizado con éxito.");
            this.style.display = 'none';
            delete this.dataset.editando;
            delete this.dataset.origen;
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = '💾 Guardar Artículo';
            this.querySelector('#articulo-codigo').disabled = false;
            this.reset();
            renderGestionEquipos();
        }
    } else {
        // --- Modo Creación ---
        const tipoForm = document.getElementById('tipo-articulo').value;
        const nombre = document.getElementById('articulo-nombre').value.trim();
        const codigo = document.getElementById('articulo-codigo').value.trim();
        if (!nombre || !codigo) return mostrarToast("Nombre y código son obligatorios.", "error");

        // ✅ Mapear tipo de formulario a tipo de Supabase
        const tipoMap = { 
            'seriado': 'equipo', 
            'ferreteria': 'tarjeta', 
            'lnb': 'lnb' 
        };
        const tipoSupabase = tipoMap[tipoForm];
        if (!tipoSupabase) return mostrarToast("Tipo de artículo no válido.", "error");

        let lista = appData.articulos[ 
            tipoForm === 'seriado' ? 'seriados' : 
            tipoForm === 'ferreteria' ? 'ferreteria' : 'lnbs'
        ];

        if (lista.some(a => a.codigo === codigo)) {
            return mostrarToast("El código ya existe. Debe ser único.", "error");
        }

        // ✅ Guardar en memoria
        lista.push({ nombre, codigo, activo: true });

        // ✅ Guardar en Supabase
        const { error } = await supabase
            .from('articulos')
            .insert([{ codigo, nombre, tipo: tipoSupabase, activo: true }]);

        if (error) {
            console.error("Error al insertar:", error);
            mostrarToast("Error al guardar en la nube.", "error");
            return;
        }

        mostrarToast(`✅ Artículo ${tipoForm} guardado con éxito.`);
        this.reset();
        this.style.display = 'none';
        renderGestionEquipos();
    }
});

async function deshabilitarArticulo(codigo, origen) {
    if (!confirm(`¿Desea deshabilitar el artículo "${codigo}"? Dejará de aparecer en asignaciones.`)) return;

    const articulo = appData.articulos[origen].find(a => a.codigo === codigo);
    if (!articulo) return;

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
        const { error } = await supabase
            .from('articulos')
            .update({ activo: false })
            .eq('codigo', codigo)
            .eq('tipo', tipo);

        if (error) throw error;

        articulo.activo = false;
        mostrarToast("✅ Artículo deshabilitado.");
        renderGestionEquipos();
    } catch (err) {
        console.error("❌ Error al deshabilitar en Supabase:", err);
        mostrarToast("Error al deshabilitar el artículo en la nube.", "error");
    }
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


// ============================================
// --- BÚSQUEDA DE SERIE (GLOBAL) ---
// ============================================
function buscarSerie() {
    const input = document.getElementById('input-buscar-serie');
    const resultadoDiv = document.getElementById('resultado-busqueda-serie');
    if (!input || !resultadoDiv) return;

    resultadoDiv.innerHTML = '';

    const termino = input.value.trim();
    if (!termino) return mostrarToast("Ingrese un número de serie o código.", "error");
    const terminoNorm = normalizarSerie(termino);
    let resultados = [];
    // Búsqueda exacta: la serie buscada debe ser igual completa
    const coincide = (a, b) => normalizarSerie(a || "") === normalizarSerie(b || "");

    // ✅ 1. BUSCAR EN ÓRDENES LIQUIDADAS (MEMORIA LOCAL)
    let encontradoEnOrden = false;
    ordenes.forEach(o => {
        if (o.estado === 'Liquidadas') {
            const todasLasSeries = [
                ...(o.series_entrada || []),
                ...(o.series_tarjetas || []),
                ...(o.series_lnb || []),
                ...(o.series_salida || [])
            ].map(s => typeof s === 'object' ? s.serie || s.serie1 : s).filter(Boolean);

            if (todasLasSeries.some(s => coincide(s, terminoNorm))) {
                
                // --- ARREGLO PARA CÓDIGO, GUÍA Y USUARIO (BUSCAR ORIGEN) ---
                let codigoReal = '—';
                let guiaReal = '—';
                let usuarioCargaNombre = '—';
                let nombreArticuloReal = 'Asignado en orden';
                let tecnicoCierre = o.tecnico || 'No especificado'; // ✅ Técnico que cerró el servicio
                let rutCliente = o.rut_cliente || 'No especificado'; // ✅ RUT del cliente

                // Buscamos en los ingresos para rescatar la info que NO está en la orden
                const buscarEnIngresos = (lista, tipo) => {
                    lista?.forEach(ing => {
                        ing.equipos?.forEach(e => { if(coincide(e.serie1, terminoNorm) || coincide(e.serie2, terminoNorm)) asignar(ing, tipo); });
                        ing.tarjetas?.forEach(t => { if(coincide(t.serie, terminoNorm)) asignar(ing, tipo); });
                        ing.lnbs?.forEach(l => { if(coincide(l.serie, terminoNorm)) asignar(ing, tipo); });
                    });
                };

                const asignar = (ingreso, tipo) => {
                    codigoReal = ingreso.articulo_codigo;
                    guiaReal = ingreso.guia || '—';
                    // Buscamos el nombre del usuario
                    const u = appData.usuarios?.find(user => user.rut === ingreso.usuario || user.nombre === ingreso.usuario);
                    usuarioCargaNombre = u ? u.nombre : (ingreso.usuario || '—');
                    
                    // Buscamos el nombre del producto
                    const maestro = tipo === 'seriado' ? appData.articulos.seriados : (tipo === 'ferreteria' ? appData.articulos.ferreteria : appData.articulos.lnbs);
                    const art = maestro?.find(a => a.codigo === ingreso.articulo_codigo);
                    if (art) nombreArticuloReal = art.nombre;
                };

                buscarEnIngresos(appData.ingresosSeriados, 'seriado');
                if (codigoReal === '—') buscarEnIngresos(appData.ingresosTarjetas, 'ferreteria');
                if (codigoReal === '—') buscarEnIngresos(appData.ingresosLNB, 'lnbs');
                // -------------------------------------------------------

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
                    tecnicoCierre: tecnicoCierre, // ✅ Agregar técnico que cerró
                    rutCliente: rutCliente // ✅ Agregar RUT del cliente
                });
                encontradoEnOrden = true;
            }
        }
    });

    // ✅ 2. SI YA ESTÁ EN UNA ORDEN, NO BUSCAR EN BODEGA NI TÉCNICOS
    if (encontradoEnOrden) {
        let html = `<h3>Resultados encontrados (${resultados.length})</h3>`;
        resultados.forEach(r => {
            const colorEstado = '#007bff';
            html += `
            <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:12px 0;border-left:4px solid ${colorEstado}">
                <p><strong>Tipo:</strong> ${r.tipo}</p>
                <p><strong>Nombre:</strong> ${r.nombreArticulo}</p>
                <p><strong>Código:</strong> ${r.codigoArticulo}</p>
                <p><strong>Guía:</strong> ${r.guia}</p>
                <p><strong>Fecha:</strong> ${r.fecha}</p>
                <p><strong>Serie:</strong> ${r.serie1}${r.serie2 ? ' / ' + r.serie2 : ''}</p>
                <p><strong>Estado:</strong> <span style="color:${colorEstado};font-weight:bold">${r.estado}</span></p>
                <p><strong>Detalle:</strong> ${r.detalle}</p>
                <p><strong>Técnico que cerró:</strong> ${r.tecnicoCierre}</p> <!-- ✅ NUEVO -->
                <p><strong>RUT Cliente:</strong> ${r.rutCliente}</p> <!-- ✅ NUEVO -->
                <p><strong>Cargado por:</strong> ${r.usuarioCarga}</p>
            </div>`;
        });
        resultadoDiv.innerHTML = html;
        return; 
    }

    // ✅ 3. SI NO ESTÁ EN ORDEN, BUSCAR EN BODEGA Y TÉCNICOS
    // ================== EQUIPOS ==================
    appData.ingresosSeriados?.forEach(ingreso => {
        (ingreso.equipos || []).forEach(eq => {
            const serie1 = eq.serie1 || '';
            const serie2 = eq.serie2 || '';
            if (!coincide(serie1, terminoNorm) && !coincide(serie2, terminoNorm)) return;
            const articulo = appData.articulos.seriados.find(a => a.codigo === ingreso.articulo_codigo);
            let estado = 'En bodega';
            let detalle = '';
            let tecnicoAsignado = null;
            appData.empleados.forEach(emp => {
                const eqStock = emp.stock?.equipos?.find(e =>
                    e.articuloCodigo === ingreso.articulo_codigo &&
                    (coincide(e.serie1, serie1) || coincide(e.serie1, serie2) || coincide(e.serie2, serie1) || coincide(e.serie2, serie2))
                );
                if (eqStock) tecnicoAsignado = `${emp.nombre1} ${emp.apepaterno}`;
            });
            if (tecnicoAsignado) { estado = 'Asignado a técnico'; detalle = tecnicoAsignado; }
            
            // Buscar nombre de usuario
            const u = appData.usuarios?.find(user => user.rut === ingreso.usuario || user.nombre === ingreso.usuario);

            resultados.push({
                tipo: 'Equipo',
                guia: ingreso.guia,
                fecha: ingreso.fecha,
                codigoArticulo: ingreso.articulo_codigo,
                nombreArticulo: articulo?.nombre || ingreso.articulo_codigo,
                serie1, serie2, estado, detalle,
                usuarioCarga: u ? u.nombre : (ingreso.usuario || '—')
            });
        });
    });

    // ================== TARJETAS ==================
    appData.ingresosTarjetas?.forEach(ingreso => {
        (ingreso.tarjetas || []).forEach(t => {
            const serie = t.serie || '';
            if (!coincide(serie, terminoNorm)) return;
            const articulo = appData.articulos.ferreteria.find(a => a.codigo === ingreso.articulo_codigo);
            let estado = 'En bodega';
            let detalle = '';
            appData.empleados.forEach(emp => {
                const tStock = emp.stock?.tarjetas?.find(tt => tt.articuloCodigo === ingreso.articulo_codigo && coincide(tt.serie, serie));
                if (tStock) detalle = `${emp.nombre1} ${emp.apepaterno}`;
            });
            if (detalle) estado = 'Asignado a técnico';

            const u = appData.usuarios?.find(user => user.rut === ingreso.usuario || user.nombre === ingreso.usuario);

            resultados.push({
                tipo: 'Tarjeta',
                guia: ingreso.guia,
                fecha: ingreso.fecha,
                codigoArticulo: ingreso.articulo_codigo,
                nombreArticulo: articulo?.nombre || ingreso.articulo_codigo,
                serie1: serie, serie2: '', estado, detalle,
                usuarioCarga: u ? u.nombre : (ingreso.usuario || '—')
            });
        });
    });

    // ================== LNBs ==================
    appData.ingresosLNB?.forEach(ingreso => {
        (ingreso.lnbs || []).forEach(l => {
            const serie = l.serie || '';
            if (!coincide(serie, terminoNorm)) return;
            const articulo = appData.articulos.lnbs.find(a => a.codigo === ingreso.articulo_codigo);
            let estado = 'En bodega';
            let detalle = '';
            appData.empleados.forEach(emp => {
                const lStock = emp.stock?.lnbs?.find(lb => lb.articuloCodigo === ingreso.articulo_codigo && coincide(lb.serie, serie));
                if (lStock) detalle = `${emp.nombre1} ${emp.apepaterno}`;
            });
            if (detalle) estado = 'Asignado a técnico';

            const u = appData.usuarios?.find(user => user.rut === ingreso.usuario || user.nombre === ingreso.usuario);

            resultados.push({
                tipo: 'LNB',
                guia: ingreso.guia,
                fecha: ingreso.fecha,
                codigoArticulo: ingreso.articulo_codigo,
                nombreArticulo: articulo?.nombre || ingreso.articulo_codigo,
                serie1: serie, serie2: '', estado, detalle,
                usuarioCarga: u ? u.nombre : (ingreso.usuario || '—')
            });
        });
    });

    // ✅ RENDERIZADO FINAL (Misma lógica original)
    if (!resultados.length) {
        resultadoDiv.innerHTML = '<p style="color:#dc3545;">❌ No se encontró ninguna serie o código.</p>';
        return;
    }

    let html = `<h3>Resultados encontrados (${resultados.length})</h3>`;
    resultados.forEach(r => {
        const colorEstado = r.estado === 'En bodega' ? '#28a745' : r.estado === 'Asignado a técnico' ? '#ffc107' : '#007bff';
        html += `
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:12px 0;border-left:4px solid ${colorEstado}">
            <p><strong>Tipo:</strong> ${r.tipo}</p>
            <p><strong>Nombre:</strong> ${r.nombreArticulo}</p>
            <p><strong>Código:</strong> ${r.codigoArticulo}</p>
            <p><strong>Guía:</strong> ${r.guia}</p>
            <p><strong>Fecha:</strong> ${r.fecha}</p>
            <p><strong>Serie:</strong> ${r.serie1}${r.serie2 ? ' / ' + r.serie2 : ''}</p>
            <p><strong>Estado:</strong> <span style="color:${colorEstado};font-weight:bold">${r.estado}</span></p>
            ${r.detalle ? `<p><strong>Detalle:</strong> ${r.detalle}</p>` : ''}
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
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
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
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; font-size: 16px;">No hay stock en bodega</td></tr>`;
    } else {
        tbody.innerHTML = saldo.map(item => `
<tr>
<td style="padding: 12px 16px; font-size: 16px;">${item.nombre}</td>
<td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.tipo}</td>
<td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.disponible}</td>
<td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.asignadoATecnicos}</td>
<td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.instalados}</td>
<td style="padding: 12px 16px; font-size: 16px; text-align: center;">${item.enBodega}</td>
</tr>
`).join('');
    }
}

function exportarStockBodegaAExcel() {
    mostrarLoader('Exportando stock completo...'); // Muestra spinner
    
    setTimeout(() => {
    const filas = [];
    const hoy = new Date();
    
    // ========================================
    // === 1. PROCESAR TODOS LOS EQUIPOS (SERIADOS) ===
    // ========================================
    (appData.ingresosSeriados || []).forEach(ingreso => {
        if (!ingreso.equipos || !Array.isArray(ingreso.equipos)) return;
        
        ingreso.equipos.forEach(eq => {
            const serie1 = eq.serie1 || '';
            if (!serie1) return;
            
            // Buscar si está asignado a algún técnico
            let tecnicoAsignado = "En bodega";
            appData.empleados.forEach(emp => {
                if (emp.stock?.equipos?.some(e => 
                    e.serie1 === serie1 && e.articuloCodigo === ingreso.articulo_codigo
                )) {
                    tecnicoAsignado = `${emp.nombre1} ${emp.apepaterno}`;
                }
            });
            
            // Buscar nombre del artículo
            const articulo = appData.articulos.seriados.find(a => a.codigo === ingreso.articulo_codigo);
            const nombreArticulo = articulo ? articulo.nombre : ingreso.articulo_codigo;
            
            // Calcular días en bodega
            const fechaIngreso = ingreso.fecha ? new Date(ingreso.fecha) : null;
            let diasEnBodega = '—';
            if (fechaIngreso && !isNaN(fechaIngreso.getTime())) {
                const diffTime = hoy - fechaIngreso;
                diasEnBodega = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            filas.push({
                'N°': filas.length + 1,
                'Serie': serie1,
                'Serie2': eq.serie2 || '',
                'Bodega': "Osorno",
                'Nombre equipo': nombreArticulo,
                'Código artículo': ingreso.articulo_codigo,
                'Tipo': "Equipo",
                'Fecha ingreso': ingreso.fecha || '—',
                'Guía': ingreso.guia || '—',
                'Días en sistema': diasEnBodega,
                'Estado': tecnicoAsignado === "En bodega" ? 'Disponible' : 'Asignado',
                'Técnico asignado': tecnicoAsignado
            });
        });
    });
    
    // ========================================
    // === 2. PROCESAR TODAS LAS TARJETAS ===
    // ========================================
    (appData.ingresosTarjetas || []).forEach(ingreso => {
        if (!ingreso.tarjetas || !Array.isArray(ingreso.tarjetas)) return;
        
        ingreso.tarjetas.forEach(t => {
            const serie = t.serie || '';
            if (!serie) return;
            
            // Buscar si está asignado a algún técnico
            let tecnicoAsignado = "En bodega";
            appData.empleados.forEach(emp => {
                if (emp.stock?.tarjetas?.some(tt => 
                    tt.serie === serie && tt.articuloCodigo === ingreso.articulo_codigo
                )) {
                    tecnicoAsignado = `${emp.nombre1} ${emp.apepaterno}`;
                }
            });
            
            // Buscar nombre del artículo
            const articulo = appData.articulos.ferreteria.find(a => a.codigo === ingreso.articulo_codigo);
            const nombreArticulo = articulo ? articulo.nombre : ingreso.articulo_codigo;
            
            // Calcular días en bodega
            const fechaIngreso = ingreso.fecha ? new Date(ingreso.fecha) : null;
            let diasEnBodega = '—';
            if (fechaIngreso && !isNaN(fechaIngreso.getTime())) {
                const diffTime = hoy - fechaIngreso;
                diasEnBodega = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            filas.push({
                'N°': filas.length + 1,
                'Serie': serie,
                'Serie2': '',
                'Bodega': "Osorno",
                'Nombre equipo': nombreArticulo,
                'Código artículo': ingreso.articulo_codigo,
                'Tipo': "Tarjeta",
                'Fecha ingreso': ingreso.fecha || '—',
                'Guía': ingreso.guia || '—',
                'Días en sistema': diasEnBodega,
                'Estado': tecnicoAsignado === "En bodega" ? 'Disponible' : 'Asignado',
                'Técnico asignado': tecnicoAsignado
            });
        });
    });
    
    // ========================================
    // === 3. PROCESAR TODOS LOS LNBs ===
    // ========================================
    (appData.ingresosLNB || []).forEach(ingreso => {
        if (!ingreso.lnbs || !Array.isArray(ingreso.lnbs)) return;
        
        ingreso.lnbs.forEach(lnb => {
            const serie = lnb.serie || '';
            if (!serie) return;
            
            // Buscar si está asignado a algún técnico
            let tecnicoAsignado = "En bodega";
            appData.empleados.forEach(emp => {
                if (emp.stock?.lnbs?.some(l => 
                    l.serie === serie && l.articuloCodigo === ingreso.articulo_codigo
                )) {
                    tecnicoAsignado = `${emp.nombre1} ${emp.apepaterno}`;
                }
            });
            
            // Buscar nombre del artículo
            const articulo = appData.articulos.lnbs.find(a => a.codigo === ingreso.articulo_codigo);
            const nombreArticulo = articulo ? articulo.nombre : ingreso.articulo_codigo;
            
            // Calcular días en bodega
            const fechaIngreso = ingreso.fecha ? new Date(ingreso.fecha) : null;
            let diasEnBodega = '—';
            if (fechaIngreso && !isNaN(fechaIngreso.getTime())) {
                const diffTime = hoy - fechaIngreso;
                diasEnBodega = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            filas.push({
                'N°': filas.length + 1,
                'Serie': serie,
                'Serie2': '',
                'Bodega': "Osorno",
                'Nombre equipo': nombreArticulo,
                'Código artículo': ingreso.articulo_codigo,
                'Tipo': "LNB",
                'Fecha ingreso': ingreso.fecha || '—',
                'Guía': ingreso.guia || '—',
                'Días en sistema': diasEnBodega,
                'Estado': tecnicoAsignado === "En bodega" ? 'Disponible' : 'Asignado',
                'Técnico asignado': tecnicoAsignado
            });
        });
    });
    
    // ========================================
    // === 4. VALIDAR Y EXPORTAR ===
    // ========================================
    if (filas.length === 0) {
        return mostrarToast("⚠️ No hay stock para exportar.", "info");
    }
    
    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filas);
    
    // Ajustar ancho de columnas automáticamente
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
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Stock_Completo");
    
    // Generar nombre de archivo con fecha
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Stock_Completo_Bodega_Tecnicos_${fechaActual}.xlsx`;
    
    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);
    
    mostrarToast(`✅ Exportadas ${filas.length} series completas (bodega + técnicos).`, "success");
    console.log(`📦 Exportación completa: ${filas.length} registros`);
     ocultarLoader(); // Oculta spinner
    }, 100);
}



function renderBodegaReversa() {
    const tbody = document.querySelector("#tabla-bodega-reversa tbody");
    if (!tbody) return;
    const datos = appData.bodegaReversa || [];
    tbody.innerHTML = datos.map(eq => `
        <tr>
            <td>${eq.codigo}</td>
            <td>${eq.serie1}/${eq.serie2}</td>
            <td>${eq.fecha}</td>
            <td>${eq.guia}</td>
        </tr>
    `).join('');
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
 * @param {string} ordenId - El ID de la orden a liquidar.
 */
function renderFormularioLiquidacion(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    // === 1. EXTRAER NÚMERO DE DECOS DEL SUBSERVICIO ===
    function extraerCantidadDecos(subservicio) {
        const match = subservicio.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
    }

    const servicio = (orden.servicio || '').trim().toLowerCase();
    const subservicio = (orden.subservicio || '').trim().toLowerCase();
    let numDecos = 0;
    let decosObligatorios = false;

    if (servicio.includes('instalacion') || servicio.includes('instalación')) {
        numDecos = extraerCantidadDecos(subservicio) || 1;
        decosObligatorios = true;
    } else if (servicio.includes('adicional')) {
        numDecos = extraerCantidadDecos(subservicio) || 1;
        decosObligatorios = true;
    } else if (
        servicio.includes('vt') ||
        servicio.includes('traslado') ||
        servicio.includes('regularizacion') || // ✅ con "c"
        servicio.includes('regularizar')      // ✅ con "z"
    ) {
        numDecos = 5;
        decosObligatorios = false;
    } else {
        numDecos = 1;
        decosObligatorios = false;
        mostrarLNB = false;
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
    const stock = tecnico.stock || { equipos: [], tarjetas: [], lnbs: [] };

    // === 3. GENERAR DATALISTS DINÁMICOS (solo serie, sin nombre largo) ===
    let datalistEquipos = '<datalist id="lista-decos">';
    if (stock.equipos?.length > 0) {
        stock.equipos.forEach(eq => {
            datalistEquipos += `<option value="${eq.serie1}"></option>`;
        });
    }
    datalistEquipos += '</datalist>';





    // === 4. CONSTRUIR HTML DINÁMICO ===
    let html = datalistEquipos;

    // --- Decos + Tarjetas instaladas ---
    for (let i = 1; i <= numDecos; i++) {
        html += `
        <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 12px; ${
            decosObligatorios ? 'border-left: 4px solid #28a745;' : ''
        }">
            <label>Deco ${i}${decosObligatorios ? ' *' : ''}:</label>
            <input type="text"
                class="input-serie-manual form-control"
                data-tipo="equipo"
                ${decosObligatorios ? 'required' : ''}
                list="lista-decos"
                placeholder="Ingrese o seleccione serie"
                style="width: 100%; padding: 6px; margin-top: 4px;">
        </div>
        `;
    }



    // ✅ Equipos y Tarjetas Retirados (solo en VT/Traslado/Regularización)
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
            <!-- Columna de Decos -->
            <div style="flex: 1; background: #fef8f8; padding: 15px; border-radius: 6px; border: 1px solid #f8d7da;">
                <h5 style="margin-top: 0; margin-bottom: 15px; color: #dc3545; font-size: 1em;">Equipos</h5>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        for (let i = 1; i <= 5; i++) {
            html += `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border: 1px solid #ced4da; border-radius: 6px;">
                <label style="font-weight: 500; color: #333; min-width: 100px; text-align: right;">Deco ${i}:</label>
                <input type="text" class="input-serie-salida" placeholder="Serie Deco ${i}" style="flex: 1; padding: 8px; border: none; outline: none; background: transparent;">
            </div>
            `;
        }
        html += `
                </div>
            </div>
            <!-- Columna de Tarjetas -->
            <div style="flex: 1; background: #fef8f8; padding: 15px; border-radius: 6px; border: 1px solid #f8d7da;">
                <h5 style="margin-top: 0; margin-bottom: 15px; color: #dc3545; font-size: 1em;">Tarjetas</h5>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        for (let i = 1; i <= 5; i++) {
            html += `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border: 1px solid #ced4da; border-radius: 6px;">
                <label style="font-weight: 500; color: #333; min-width: 100px; text-align: right;">Tarjeta ${i}:</label>
                <input type="text" class="input-tarjeta-salida" placeholder="Serie Tarjeta ${i}" style="flex: 1; padding: 8px; border: none; outline: none; background: transparent;">
            </div>
            `;
        }
        html += `
                </div>
            </div>
        </div>
        `;
    }

    document.getElementById('contenedor-series').innerHTML = html;

    // === 4b. PRE-LLENAR SERIES SI LA ORDEN YA TIENE DATOS (reversa) ===
    if (orden.series_entrada?.length) {
        const inputsEquipo = document.querySelectorAll('#contenedor-series .input-serie-manual[data-tipo="equipo"]');
        orden.series_entrada.forEach((serie, idx) => {
            if (inputsEquipo[idx]) inputsEquipo[idx].value = serie;
        });
    }


    if (orden.series_salida?.length) {
        const inputsSalida = document.querySelectorAll('#contenedor-series .input-serie-salida');
        orden.series_salida.forEach((serie, idx) => {
            if (inputsSalida[idx]) inputsSalida[idx].value = serie;
        });
    }

    // === 5. VALIDACIÓN EN TIEMPO REAL (existencia + duplicados) ===
    const inputsSeries = document.querySelectorAll('.input-serie-manual');
    const valoresActuales = new Set();
    inputsSeries.forEach(input => {
        input.dataset.prevValue = input.value.trim();

        input.addEventListener('blur', function () {
            const serie = this.value.trim();
            const prev = this.dataset.prevValue || '';
            if (!serie) {
                if (prev) valoresActuales.delete(prev);
                delete this.dataset.prevValue;
                verificarBotonLiquidacion();
                return;
            }
            if (!validarSerieExiste(serie)) {
                mostrarToastFront(`La serie "${serie}" no existe en el sistema.`, "error");
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                delete this.dataset.prevValue;
                this.focus();
                verificarBotonLiquidacion();
                return;
            }
            const otros = Array.from(valoresActuales).filter(v => v !== prev);
            if (otros.includes(serie)) {
                mostrarToastFront(`La serie "${serie}" ya está seleccionada.`, "error");
                this.value = '';
                if (prev) valoresActuales.delete(prev);
                delete this.dataset.prevValue;
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
    });

    verificarBotonLiquidacion();
}

// Mostrar mensaje al frente (no detrás del modal)
function mostrarToastFront(mensaje, tipo = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${tipo === "error" ? "#dc3545" : tipo === "success" ? "#28a745" : "#17a2b8"};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
    }

    // Validar si una serie existe en cualquier ingreso
    function validarSerieExiste(serie) {
    if (!serie) return false;
    for (const ing of appData.ingresosSeriados || []) {
        for (const eq of ing.equipos || []) {
        if (eq.serie1 === serie || eq.serie2 === serie) return true;
        }
    }
    for (const ing of appData.ingresosTarjetas || []) {
        for (const t of ing.tarjetas || []) {
        if (t.serie === serie) return true;
        }
    }
    for (const ing of appData.ingresosLNB || []) {
        for (const l of ing.lnbs || []) {
        if (l.serie === serie) return true;
        }
    }
    return false;
}

/**
 * Guarda la liquidación de una orden en Supabase y rebaja el stock del técnico.
 * Combina equipos y tarjetas retirados en un solo campo: series_salida.
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
    const codigoPerdida = document.getElementById('liquidacion-codigo-perdida')?.value.trim() || null;
    
    if (!nombreRecibe || !telefonoContacto || !coordenadas || !observaciones || observaciones.length < 5) {
        mostrarToast("❌ Complete todos los campos obligatorios.", "error");
        return;
    }
    
    // === 2. CAPTURAR FERRETERÍA (NUEVO) ===
    const ferreteria = {
        conectores: document.getElementById('ferreteria-conectores')?.value || '0',
        lnb: document.getElementById('ferreteria-lnb')?.value || '',
        cable: document.getElementById('ferreteria-cable')?.value || '0',
        antena: document.getElementById('ferreteria-antena')?.value || ''
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
    
    // === 4. CAPTURAR SERIES INSTALADAS ===
    const seriesEntrada = [];
    const seriesTarjetas = [];
    const seriesLNB = [];
    
    // --- Decos ---
    document.querySelectorAll('#contenedor-series .input-serie-manual[data-tipo="equipo"]').forEach(input => {
        const valor = input.value.trim();
        if (!valor) return;
        const partes = valor.split('-');
        const serie = partes.length > 1 ? partes[partes.length - 1].trim() : valor;
        const eq = tecnico.stock?.equipos?.find(e => e.serie1 === serie || e.serie2 === serie);
        if (eq) {
            seriesEntrada.push(eq.serie1);
        }
    });
    
    // --- Tarjetas instaladas ---
    document.querySelectorAll('#contenedor-series .input-serie-manual[data-tipo="tarjeta"]').forEach(input => {
        const valor = input.value.trim();
        if (!valor) return;
        const partes = valor.split('-');
        const serie = partes.length > 1 ? partes[partes.length - 1].trim() : valor;
        const t = tecnico.stock?.tarjetas?.find(t => t.serie === serie);
        if (t) {
            seriesTarjetas.push(t.serie);
        }
    });
    
    // --- LNB ---
    const inputLNB = document.getElementById('input-lnb-liquidacion');
    if (inputLNB?.value?.trim()) {
        const valor = inputLNB.value.trim();
        const partes = valor.split('-');
        const serie = partes.length > 1 ? partes[partes.length - 1].trim() : valor;
        const l = tecnico.stock?.lnbs?.find(l => l.serie === serie);
        if (l) {
            seriesLNB.push(l.serie);
        }
    }
    
    // === 5. CAPTURAR SERIES RETIRADAS ===
    const seriesSalidaPlanas = [];
    document.querySelectorAll('#contenedor-series .input-serie-salida').forEach(input => {
        const v = input.value.trim();
        if (v) seriesSalidaPlanas.push(v);
    });
    document.querySelectorAll('#contenedor-series .input-tarjeta-salida').forEach(input => {
        const v = input.value.trim();
        if (v) seriesSalidaPlanas.push(v);
    });
    
    // === 6. ACTUALIZAR ORDEN EN SUPABASE ===
    const { error: errOrd } = await supabase
        .from('ordenes')
        .update({
            estado: 'Liquidadas',
            nombre_recibe: nombreRecibe,
            telefono_contacto: telefonoContacto,
            coordenadas: coordenadas,
            observacion: observaciones,
            series_entrada: seriesEntrada.length ? seriesEntrada : null,
            series_tarjetas: seriesTarjetas.length ? seriesTarjetas : null,
            series_lnb: seriesLNB.length ? seriesLNB : null,
            series_salida: seriesSalidaPlanas.length ? seriesSalidaPlanas : null,
            ferreteria: ferreteria,
            codigo_perdida: codigoPerdida
        })
        .eq('id', ordenId);
    
    if (errOrd) {
        console.error("Error al liquidar:", errOrd);
        mostrarToast("❌ Error al guardar orden.", "error");
        return;
    }
    
    // === 7. ELIMINAR SERIES DEL STOCK DEL TÉCNICO ===
    const eliminarDelStock = async (tipo, seriesArr) => {
        if (!seriesArr.length) return;
        const tipoAsignacion = tipo === 'equipo' ? 'equipo' : tipo;
        const { data: asignaciones, error } = await supabase
            .from('asignaciones')
            .select('*')
            .eq('tecnico_id', tecnico.id)
            .eq('tipo', tipoAsignacion);
        
        if (error || !asignaciones?.length) return;
        
        for (const asignacion of asignaciones) {
            let nuevasSeries;
            if (tipo === 'equipo') {
                nuevasSeries = asignacion.series.filter(s => {
                    const s1 = (typeof s === 'object' && s !== null) ? s.serie1 : s;
                    return !seriesArr.includes(s1);
                });
            } else {
                nuevasSeries = asignacion.series.filter(s => {
                    const sv = (typeof s === 'object' && s !== null) ? s.serie : s;
                    return !seriesArr.includes(sv);
                });
            }
            if (nuevasSeries.length === 0) {
                await supabase.from('asignaciones').delete().eq('id', asignacion.id);
            } else {
                await supabase.from('asignaciones').update({ series: nuevasSeries }).eq('id', asignacion.id);
            }
        }
    };
    
    await eliminarDelStock('equipo', seriesEntrada);
    await eliminarDelStock('tarjeta', seriesTarjetas);
    await eliminarDelStock('lnb', seriesLNB);
    
    // === 8. ACTUALIZAR MEMORIA LOCAL ===
    if (tecnico.stock) {
        if (Array.isArray(tecnico.stock.equipos)) {
            const seriesEquiposAEliminar = new Set(seriesEntrada);
            tecnico.stock.equipos = tecnico.stock.equipos.filter(eq => !seriesEquiposAEliminar.has(eq.serie1));
        }
        if (Array.isArray(tecnico.stock.tarjetas)) {
            const seriesTarjetasAEliminar = new Set(seriesTarjetas);
            tecnico.stock.tarjetas = tecnico.stock.tarjetas.filter(t => !seriesTarjetasAEliminar.has(t.serie));
        }
        if (Array.isArray(tecnico.stock.lnbs)) {
            const seriesLnbAEliminar = new Set(seriesLNB);
            tecnico.stock.lnbs = tecnico.stock.lnbs.filter(l => !seriesLnbAEliminar.has(l.serie));
        }
    }
    
    // === 9. ACTUALIZAR ORDEN EN MEMORIA LOCAL ===
    const ordenLocal = ordenes.find(o => o.id === ordenId);
    if (ordenLocal) {
        ordenLocal.estado = 'Liquidadas';
        ordenLocal.nombre_recibe = nombreRecibe;
        ordenLocal.telefono_contacto = telefonoContacto;
        ordenLocal.coordenadas = coordenadas;
        ordenLocal.observacion_liquidacion = observaciones;
        ordenLocal.series_entrada = seriesEntrada;
        ordenLocal.series_tarjetas = seriesTarjetas;
        ordenLocal.series_lnb = seriesLNB;
        ordenLocal.series_salida = seriesSalidaPlanas;
        ordenLocal.ferreteria = ferreteria; // ✅ NUEVO
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
    const campos = ['nombre-recibe', 'telefono-contacto', 'coordenadas', 'liquidacion-observacion', 'liquidacion-codigo-perdida'];
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
    if (orden.codigo_perdida) {
        const el = document.getElementById('liquidacion-codigo-perdida');
        if (el) el.value = orden.codigo_perdida;
    }
    // Pre-llenar ferretería si la orden ya tiene datos
    if (orden.ferreteria && typeof orden.ferreteria === 'object') {
        const f = orden.ferreteria;
        const fc = document.getElementById('ferreteria-conectores');
        const fl = document.getElementById('ferreteria-lnb');
        const fca = document.getElementById('ferreteria-cable');
        const fa = document.getElementById('ferreteria-antena');
        if (fc && f.conectores) fc.value = f.conectores;
        if (fl && f.lnb) fl.value = f.lnb;
        if (fca && f.cable) fca.value = f.cable;
        if (fa && f.antena) fa.value = f.antena;
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
    if (habilitado) {
        btnConfirmar.textContent = '✅ Liquidar Orden';
        btnConfirmar.style.backgroundColor = '#28a745';
        btnConfirmar.style.opacity = '1';
        btnConfirmar.style.cursor = 'pointer';
    } else {
        btnConfirmar.textContent = '❌ Faltan datos...';
        btnConfirmar.style.backgroundColor = '#6c757d';
        btnConfirmar.style.opacity = '0.5';
        btnConfirmar.style.cursor = 'not-allowed';
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
    const fecha = new Date().toISOString().split('T')[0];

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
        safeAddListener('btnSiguientePaso1', 'click', validarNumeroOrden);
        safeAddListener('btnValidarCombinacion', 'click', validarCombinacion);
        safeAddListener('btnVolverPaso1', 'click', () => {
            document.getElementById('paso-2').style.display = 'none';
            document.getElementById('paso-1').style.display = 'block';
        });
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
                mostrarToast("Debe seleccionar ambas fechas.", "error");
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
        safeAddListener('btnFiltrarRechazadas', 'click', () => {
            const inicio = document.getElementById('filtro-rechazo-inicio')?.value;
            const fin = document.getElementById('filtro-rechazo-fin')?.value;
            if (!inicio || !fin) {
                mostrarToast("Debe seleccionar ambas fechas.", "error");
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
        
        safeAddListener('btn-crear-LNB', 'click', () => {
            document.getElementById('form-crear-lnb').style.display = 'block';
        });
        
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
                el.addEventListener('input', (e) => formatearRut(e.target));
                el.addEventListener('blur', (e) => validarRutInput(e.target));
            }
        });
        
        function formatearRut(inputElement) {
            let valor = inputElement.value.replace(/[^0-9kK]/g, '').toLowerCase();
            if (!valor) return;
            let cuerpo = valor.slice(0, -1);
            let dv = valor.slice(-1);
            cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            inputElement.value = cuerpo + '-' + dv;
        }
        
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
        if (typeof actualizarPersonalDTH === 'function') {
            actualizarPersonalDTH();
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
});
    
// =======================================================
// --- FUNCIONES GLOBALES PARA TRANSFERENCIA DE MATERIALES ---
// =======================================================

/**
 * Muestra el stock de materiales disponibles para transferir desde un técnico.
 * @param {string} tecnicoId - El ID del técnico origen (opcional, se toma del select si no se pasa).
 */

window.mostrarStockOrigen = function(tecnicoId) {
    const origenId = tecnicoId || document.getElementById('tec-origen')?.value;
    
    const divStock = document.getElementById('stock-origen');
    const divDestino = document.getElementById('contenedor-destino');
    const btnTrans = document.getElementById('btn-transferir');
    const listaHtml = document.getElementById('lista-materiales-origen');

    if (!origenId) {
        if(divStock) divStock.style.display = 'none';
        if(divDestino) divDestino.style.display = 'none';
        if(btnTrans) btnTrans.style.display = 'none';
        return;
    }

    const origen = appData.empleados.find(e => e.id === origenId);
    if (!origen || !origen.stock) {
        listaHtml.innerHTML = '<p style="color:#6c757d; padding:10px;">Este técnico no tiene materiales asignados.</p>';
        mostrarContenedores();
        return;
    }

    let html = '';

    // Renderizado de Equipos
    if (origen.stock.equipos?.length > 0) {
        html += `<h5 style="margin-top:15px; margin-bottom:8px; color:#007bff; border-bottom:1px solid #eee;">Equipos:</h5>`;
        origen.stock.equipos.forEach(eq => {
            const articulo = appData.articulos.seriados.find(a => a.codigo === eq.articuloCodigo);
            html += `
            <div class="lista-seriados-item">
                <input type="checkbox" class="chk-transferir" onchange="actualizarResumenTransferencia()" 
                    data-tipo="equipo" 
                    data-serie1="${eq.serie1}" 
                    data-serie2="${eq.serie2|| ''}" 
                    data-codigo="${eq.articuloCodigo}" 
                    data-guia="${eq.guiaAsignacion|| ''}">
                <span class="articulo-y-serie">${articulo?.nombre || eq.articuloCodigo} - ${eq.serie1}${eq.serie2 ? ' / ' + eq.serie2 : ''}</span>
            </div>`;
        });
    }

    // === Tarjetas ===
    if (origen.stock.tarjetas?.length > 0) {
        html += `<h5 style="margin-top:15px; margin-bottom:8px; color:#007bff; border-bottom:1px solid #eee;">Tarjetas:</h5>`;
        origen.stock.tarjetas.forEach(t => {
            const articulo = appData.articulos.ferreteria.find(a => a.codigo === t.articuloCodigo);
            html += `
            <div class="lista-seriados-item">
                <input type="checkbox" class="chk-transferir" onchange="actualizarResumenTransferencia()" 
                    data-tipo="tarjeta" 
                    data-serie="${t.serie}" 
                    data-codigo="${t.articuloCodigo}" 
                    data-guia="${t.guiaAsignacion|| ''}">
                <span class="articulo-y-serie">${articulo?.nombre || t.articuloCodigo} - ${t.serie}</span>
            </div>`;
        });
    }

    // === LNBs ===
    if (origen.stock.lnbs?.length > 0) {
        html += `<h5 style="margin-top:15px; margin-bottom:8px; color:#007bff; border-bottom:1px solid #eee;">LNBs:</h5>`;
        origen.stock.lnbs.forEach(lnb => {
            const articulo = appData.articulos.lnbs.find(a => a.codigo === lnb.articuloCodigo);
            html += `
            <div class="lista-seriados-item">
                <input type="checkbox" class="chk-transferir" onchange="actualizarResumenTransferencia()" 
                    data-tipo="lnb" 
                    data-serie="${lnb.serie}" 
                    data-codigo="${lnb.articuloCodigo}" 
                    data-guia="${lnb.guiaAsignacion|| ''}">
                <span class="articulo-y-serie">${articulo?.nombre || lnb.articuloCodigo} - ${lnb.serie}</span>
            </div>`;
        });
    }

    listaHtml.innerHTML = html || '<p style="color:#6c757d; padding:10px;">Sin materiales disponibles.</p>';
    mostrarContenedores();

    function mostrarContenedores() {
        if(divStock) divStock.style.display = 'block';
        if(divDestino) divDestino.style.display = 'block';
        if(btnTrans) btnTrans.style.display = 'inline-block';
    }
}

/**
* Transfiere materiales seleccionados entre técnicos y persiste los cambios en Supabase.
*/


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
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const horaActual = new Date().toLocaleTimeString('es-CL', {
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
            <button class="gp-btn gp-btn-print" onclick="window.print()">
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

    if (!confirm(`🔄 ¿Reversar la orden #${numero} al estado "Agendada"?\n\nTodos los datos se conservan para que puedas editar y volver a liquidar.`)) {
        return false;
    }

    try {
        // === ✅ ACTUALIZAR ORDEN EN SUPABASE ===
        // Solo cambiamos el estado — todos los datos de liquidación se mantienen
        // para que al volver a liquidar el modal aparezca pre-llenado
        const { error } = await supabase
            .from('ordenes')
            .update({
                estado: 'Agendada',
                equipo_reversado: false
            })
            .eq('numero', numero);

        if (error) throw error;

        // === ✅ ACTUALIZAR EN MEMORIA LOCAL ===
        // Solo estado y equipo_reversado — datos de liquidación se conservan
        orden.estado = "Agendada";
        orden.equipo_reversado = false;

        // === ✅ REFRESCAR DATOS Y UI ===
        mostrarToast(`✅ Orden #${numero} revertida a "Agendada". Los datos se mantienen para re-liquidar.`, "success");

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

        return true;
    } catch (err) {
        console.error("🔥 Error al reversar:", err);
        mostrarToast("❌ Error al reversar la orden.", "error");
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

    // Crear nuevo usuario
    const nuevoUsuario = {
    id: `usr-${Date.now()}`,
    rut: rutGuardar,
    nombre,
    rol,
    pass,
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
 * Elimina una serie del sistema (de ingresosSeriados, ingresosTarjetas o ingresosLNB).
 * @param {string} serie - La serie a eliminar.
 * @param {string} tipo - 'equipo', 'tarjeta' o 'lnb'.
 */
async function eliminarSerieDelSistema(serie, tipo) {
    try {
        let tabla = '';
        let campoSerie = '';
        if (tipo === 'equipo') {
            tabla = 'ingresos_seriados';
            campoSerie = 'equipos';
        } else if (tipo === 'tarjeta') {
            tabla = 'ingresos_tarjetas';
            campoSerie = 'tarjetas';
        } else if (tipo === 'lnb') {
            tabla = 'ingresos_lnb';
            campoSerie = 'lnbs';
        } else {
            mostrarToast("Tipo de serie no válido.", "error");
            return;
        }

        // Buscar el registro que contiene la serie
        const { data, error } = await supabase
            .from(tabla)
            .select('*')
            .filter(campoSerie, 'cs', `{\"serie1\":\"${serie}\"}`)
            .or(`cs.${campoSerie}.{"serie":"${serie}"}`);

        if (error) throw error;
        if (!data || data.length === 0) {
            // Búsqueda flexible si la primera falla
            const {  data2 } = await supabase.from(tabla).select('*');
            const ingresoEncontrado = data2.find(ing => {
                if (tipo === 'equipo') {
                    return ing.equipos?.some(eq => eq.serie1 === serie || eq.serie2 === serie);
                } else {
                    return ing[campoSerie]?.some(item => item.serie === serie);
                }
            });
            if (!ingresoEncontrado) {
                mostrarToast("Serie no encontrada en el sistema.", "error");
                return;
            }
            data[0] = ingresoEncontrado;
        }

        const ingreso = data[0];
        let nuevasSeries = [];
        if (tipo === 'equipo') {
            nuevasSeries = (ingreso.equipos || []).filter(eq => eq.serie1 !== serie && eq.serie2 !== serie);
        } else {
            nuevasSeries = (ingreso[campoSerie] || []).filter(item => item.serie !== serie);
        }

        if (nuevasSeries.length === 0) {
            // Eliminar todo el registro si no quedan series
            await supabase.from(tabla).delete().eq('id', ingreso.id);
        } else {
            // Actualizar solo las series
            await supabase.from(tabla).update({ [campoSerie]: nuevasSeries }).eq('id', ingreso.id);
        }

        // Actualizar appData local
        if (tipo === 'equipo') {
            appData.ingresosSeriados = (appData.ingresosSeriados || []).map(i =>
                i.id === ingreso.id ? { ...i, equipos: nuevasSeries } : i
            ).filter(i => (i.equipos || []).length > 0);
        } else if (tipo === 'tarjeta') {
            appData.ingresosTarjetas = (appData.ingresosTarjetas || []).map(i =>
                i.id === ingreso.id ? { ...i, tarjetas: nuevasSeries } : i
            ).filter(i => (i.tarjetas || []).length > 0);
        } else if (tipo === 'lnb') {
            appData.ingresosLNB = (appData.ingresosLNB || []).map(i =>
                i.id === ingreso.id ? { ...i, lnbs: nuevasSeries } : i
            ).filter(i => (i.lnbs || []).length > 0);
        }

        mostrarToast("✅ Serie eliminada del sistema.", "success");
    } catch (err) {
        console.error("Error al eliminar serie:", err);
        mostrarToast("❌ Error al eliminar la serie. Verifique la consola.", "error");
    }
}

// Listener

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
            tipo: tipoEncontrado,
            codigo_articulo: codigoArticulo,
            usuario: usuario,
            fecha_eliminacion: new Date().toISOString()
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

    // Buscar en memoria: órdenes Liquidadas del técnico con series_salida y sin reversar
    const tecnico = appData.empleados.find(e => e.id === tecnicoId);
    const nombreTecnico = tecnico ? `${tecnico.nombre1} ${tecnico.apepaterno}`.trim() : '';

    const ordenesConReversa = ordenes.filter(o => {
        const esTecnico = o.tecnico === nombreTecnico || o.tecnico === tecnicoId;
        const esLiquidada = o.estado === 'Liquidadas' || o.estado === 'Liquidada';
        const tieneEquipos = Array.isArray(o.series_salida) && o.series_salida.length > 0;
        const noReversada = !o.equipo_reversado;
        return esTecnico && esLiquidada && tieneEquipos && noReversada;
    });

    if (ordenesConReversa.length === 0) {
        wrapper.innerHTML = '<p style="color:#888; padding:15px;">✅ No hay órdenes pendientes de reversa para este técnico.</p>';
        return;
    }

    wrapper.innerHTML = '';
    ordenesConReversa.forEach(orden => {
        const series = orden.series_salida || [];
        const card = document.createElement('div');
        card.style.cssText = 'background:#fff; border:1px solid #cce5ff; border-radius:8px; padding:15px; margin-bottom:12px;';
        card.id = `orden-reversa-${orden.id}`;

        const listaSeries = series.map(s =>
            `<span style="display:inline-block; background:#e7f3ff; border:1px solid #007bff; border-radius:4px; padding:3px 10px; margin:3px; font-family:monospace; font-size:13px;">${s}</span>`
        ).join('');

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                <div>
                    <strong style="font-size:15px; color:#007bff;">📋 Orden: ${orden.numero}</strong>
                    <span style="margin-left:10px; color:#666; font-size:13px;">${orden.nombre_cliente || ''}</span>
                    <div style="color:#555; font-size:13px; margin-top:4px;">📅 ${orden.fecha_liquidacion || orden.fecha} — ${orden.servicio || ''} ${orden.subservicio || ''}</div>
                    <div style="margin-top:8px;"><strong style="font-size:13px;">Equipos a reversar (${series.length}):</strong><br>${listaSeries}</div>
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
async function confirmarReversaOrden(ordenId, numeroOrden) {
    const btn = document.querySelector(`#orden-reversa-${ordenId} button`);
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Registrando...'; }

    try {
        const orden = ordenes.find(o => o.id === ordenId);
        if (!orden) throw new Error('Orden no encontrada en memoria');

        const series = orden.series_salida || [];
        const tecnicoId = devolucionState.reversa.tecnico;
        const tecnico = appData.empleados.find(e => e.id === tecnicoId);
        const nombreTecnico = tecnico ? `${tecnico.nombre1} ${tecnico.apepaterno}`.trim() : tecnicoId;
        const fecha = new Date().toISOString().split('T')[0];

        // 1. Insertar cada serie en bodega_reversa
        const registros = series.map(serie => ({
            tipo: 'reversa',
            serie: serie,
            guia: orden.numero,
            fecha: fecha,
            numero_orden: numeroOrden,
            tecnico: nombreTecnico,
            articulo: null
        }));

        const { error: errInsert } = await supabase
            .from('bodega_reversa')
            .insert(registros);

        if (errInsert) throw errInsert;

        // 2. Marcar la orden como reversada en Supabase
        const { error: errUpdate } = await supabase
            .from('ordenes')
            .update({ equipo_reversado: true })
            .eq('id', ordenId);

        if (errUpdate) throw errUpdate;

        // 3. Actualizar en memoria local
        const idx = ordenes.findIndex(o => o.id === ordenId);
        if (idx >= 0) ordenes[idx].equipo_reversado = true;

        // 4. Actualizar bodegaReversa en appData
        registros.forEach(r => appData.bodegaReversa.push(r));

        // 5. Quitar la card de la vista
        const card = document.getElementById(`orden-reversa-${ordenId}`);
        if (card) {
            card.style.background = '#d4edda';
            card.innerHTML = `<p style="color:#155724; padding:5px;">✅ Orden ${numeroOrden} — ${series.length} equipo(s) recibido(s) en bodega.</p>`;
            setTimeout(() => card.remove(), 2500);
        }

        mostrarToast(`✅ Orden ${numeroOrden}: ${series.length} equipo(s) registrado(s) en Bodega Reversa`, 'success');

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

    if (!fecha) { mostrarToast('⚠️ Debe ingresar la fecha', 'warning'); throw new Error('Falta fecha'); }

    const registros = [];
    for (let i = 1; i <= cantidad; i++) {
        const input = document.getElementById(`serie-nmalos-${i}`);
        const serie = input?.value?.trim();
        if (!serie) { mostrarToast(`⚠️ Falta serie del equipo ${i}`, 'warning'); throw new Error(`Falta serie ${i}`); }

        const itemStock = stock.find(s => s.serie1 === serie || s.serie2 === serie);
        if (!itemStock) { mostrarToast(`❌ Serie ${serie} no válida`, 'error'); throw new Error(`Serie inválida: ${serie}`); }

        registros.push({
            tecnico_id: tecnicoId,
            serie1: itemStock.serie1,
            serie2: itemStock.serie2 || null,
            articulo_codigo: itemStock.articuloCodigo,
            articulo_nombre: itemStock.articuloNombre || null,
            fecha_devolucion: fecha,
            observacion: observacion || null,
            tipo: 'nmalos',
            estado: 'pendiente_revision'
        });
    }

    // Insertar en bodega_malos
    const { error: errInsert } = await window.supabaseClient
        .from('bodega_malos')
        .insert(registros);

    if (errInsert) throw errInsert;

    // Actualizar estado de asignaciones a 'devuelto'
    for (const reg of registros) {
        await window.supabaseClient
            .from('asignaciones')
            .update({ estado: 'devuelto_nmalos' })
            .eq('tecnicoId', tecnicoId)
            .or(`serie1.eq.${reg.serie1},serie2.eq.${reg.serie1}`);
    }

    mostrarToast(`✅ ${registros.length} equipo(s) registrado(s) en Bodega Malos`, 'success');
    resetFormulario('nmalos');
    document.getElementById('tipo-devolucion').value = '';
    document.getElementById('form-nmalos').style.display = 'none';
}

// ─── 12b. REGISTRAR REVERSA ─────────────────────────────────
// El flujo de reversa ahora opera por confirmarReversaOrden()
// Esta función se mantiene por compatibilidad pero no se usa
async function registrarReversa() {
    mostrarToast('Use el botón "Confirmar Recepción" en cada orden', 'info');
}

// ─── 13. INICIALIZACIÓN (reemplaza onchange inline del HTML) ─
// LLAMAR ESTO AL FINAL DEL DOMContentLoaded en app.js

// ─── EXPORT (por si usas módulos) ───────────────────────────
// Si no usas módulos, estas funciones quedan globales automáticamente


/**
 * Cambia entre los formularios según el tipo de devolución
 */
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
    let ordenesFiltradas = ordenes.filter(o => {
        // Filtro por fecha inicio
        if (fechaInicio && o.fecha < fechaInicio) return false;
        // Filtro por fecha fin
        if (fechaFin && o.fecha > fechaFin) return false;
        // Filtro por técnico
        if (tecnico && o.tecnico !== tecnico) return false;
        // Filtro por servicio
        if (servicio && o.servicio !== servicio) return false;
        // Filtro por estado (✅ CORREGIDO: aceptar AMBAS formas)
        if (estado) {
            const estadoOrden = (o.estado || '').toLowerCase();
            const estadoFiltro = estado.toLowerCase();
            // Aceptar "liquidada", "liquidadas", "agendada", "rechazada", etc.
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
                rechazadas: 0
            };
        }
        tecnicoStats[tecnico].ordenes++;
        
        // Contar por estado (✅ CORREGIDO: aceptar AMBAS formas)
        const estado = (orden.estado || '').toLowerCase();
        if (estado.includes('agendada')) tecnicoStats[tecnico].agendadas++;
        if (estado.includes('liquidada')) tecnicoStats[tecnico].liquidadas++;  // ✅ Ahora acepta "liquidadas" también
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
        // === 1. Eliminar de Supabase (tabla `asignaciones`) ===
        const { data: asignaciones } = await supabase
            .from('asignaciones')
            .select('*')
            .eq('tecnico_id', tecnicoEncontrado.id);

        let asignacionActualizada = false;
        for (const asig of asignaciones) {
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
            tecnicoEncontrado.stock.equipos = tecnicoEncontrado.stock.equipos.filter(eq => eq.serie1 !== serie && eq.serie2 !== serie);
        } else if (tipoSerie === 'tarjeta') {
            tecnicoEncontrado.stock.tarjetas = tecnicoEncontrado.stock.tarjetas.filter(t => t.serie !== serie);
        } else if (tipoSerie === 'lnb') {
            tecnicoEncontrado.stock.lnbs = tecnicoEncontrado.stock.lnbs.filter(l => l.serie !== serie);
        }

        // === 3. Registrar en bitácora ===
        const usuario = window.usuarioActivo?.nombre || 'Usuario desconocido';
        await supabase.from('bitacora').insert({
            serie: serie,
            tipo: tipoSerie,
            codigo_articulo: null,
            usuario: usuario,
            fecha_eliminacion: new Date().toISOString(),
            observacion: 'Eliminado manualmente (modo emergencia)'
        });

        resultadoDiv.innerHTML = `<p style="color:#28a745;">✅ Serie "${serie}" eliminada de Supabase y stock local.</p>`;
        input.value = '';

    } catch (err) {
        console.error("Error:", err);
        resultadoDiv.innerHTML = `<p style="color:#dc3545;">❌ Error: ${err.message}</p>`;
    }
}

document.getElementById('btn-eliminar-serie-sistema')?.addEventListener('click', eliminarSerieAsignadaDirectamente);

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
