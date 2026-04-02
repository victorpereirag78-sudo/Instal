-- ============================================================
-- INSTAL - Script SQL para Supabase
-- Ejecutar en SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. EMPLEADOS
CREATE TABLE empleados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rut TEXT UNIQUE NOT NULL,
    nombre1 TEXT,
    nombre2 TEXT,
    apepaterno TEXT,
    apematerno TEXT,
    cargoId TEXT,
    telefono TEXT,
    direccion TEXT,
    region TEXT,
    comuna TEXT,
    email TEXT,
    observacion TEXT,
    fechaNacimiento TEXT,
    fechaIngreso TEXT,
    activo BOOLEAN DEFAULT true,
    stock JSONB DEFAULT '{"equipos":[]}'::jsonb
);

-- 2. ORDENES
CREATE TABLE ordenes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT UNIQUE NOT NULL,
    rut_cliente TEXT,
    nombre_cliente TEXT,
    numero_contacto TEXT,
    telefono_contacto TEXT,
    direccion TEXT,
    comuna TEXT,
    region TEXT,
    servicio TEXT,
    subservicio TEXT,
    tecnico TEXT,
    estado TEXT DEFAULT 'Agendada',
    fecha TEXT,
    observacion TEXT,
    series_entrada JSONB,
    series_salida JSONB,
    despacho TEXT,
    motivo_rechazo TEXT,
    observacion_rechazo TEXT,
    fecha_liquidacion TEXT,
    coordenadas TEXT,
    nombre_recibe TEXT,
    observacion_liquidacion TEXT,
    ferreteria JSONB,
    equipo_reversado BOOLEAN DEFAULT false,
    codigo_perdida TEXT
);

-- 3. ASIGNACIONES (stock técnicos)
CREATE TABLE asignaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tecnico_id UUID REFERENCES empleados(id),
    tipo TEXT,
    articulo_codigo TEXT,
    series JSONB DEFAULT '[]'::jsonb,
    fecha TEXT,
    guia_salida TEXT
);

-- 4. INGRESOS SERIADOS (bodega equipos)
CREATE TABLE ingresos_seriados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    articulo_codigo TEXT,
    equipos JSONB DEFAULT '[]'::jsonb,
    guia TEXT,
    fecha TEXT,
    usuario TEXT,
    observacion TEXT
);

-- 5. BODEGA REVERSA
CREATE TABLE bodega_reversa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo TEXT,
    serie TEXT,
    guia TEXT,
    fecha TEXT,
    numero_orden TEXT,
    tecnico TEXT,
    articulo TEXT
);

-- 6. USUARIOS (login)
CREATE TABLE usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rut TEXT UNIQUE NOT NULL,
    nombre TEXT,
    password TEXT,
    rol TEXT
);

-- 7. ARTICULOS (maestro de productos)
CREATE TABLE articulos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT,
    tipo TEXT,
    activo BOOLEAN DEFAULT true
);

-- ============================================================
-- HABILITAR RLS (Row Level Security) - recomendado
-- ============================================================
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos_seriados ENABLE ROW LEVEL SECURITY;
ALTER TABLE bodega_reversa ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para anon (ajustar según necesidad)
CREATE POLICY "Allow all" ON empleados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON ordenes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON asignaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON ingresos_seriados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON bodega_reversa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON articulos FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- USUARIO ADMIN INICIAL
-- ============================================================
INSERT INTO usuarios (rut, nombre, password, rol)
VALUES ('admin', 'Administrador', 'admin123', 'admin');
