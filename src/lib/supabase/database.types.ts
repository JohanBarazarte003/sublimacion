export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ajustes: {
        Row: {
          actualizado_en: string
          clave: string
          publico: boolean
          valor: Json
        }
        Insert: {
          actualizado_en?: string
          clave: string
          publico?: boolean
          valor: Json
        }
        Update: {
          actualizado_en?: string
          clave?: string
          publico?: boolean
          valor?: Json
        }
        Relationships: []
      }
      cotizacion_eventos: {
        Row: {
          actor: string
          cotizacion_id: string
          creado_en: string
          detalle: Json
          id: string
          tipo: string
        }
        Insert: {
          actor?: string
          cotizacion_id: string
          creado_en?: string
          detalle?: Json
          id?: string
          tipo: string
        }
        Update: {
          actor?: string
          cotizacion_id?: string
          creado_en?: string
          detalle?: Json
          id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_eventos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizacion_items: {
        Row: {
          ajuste_diseno: Json
          cantidad: number
          cotizacion_id: string
          creado_en: string
          descuento_unitario: number
          id: string
          notas: string | null
          opciones: Json
          precio_unitario: number | null
          producto_id: string
          variante_id: string | null
        }
        Insert: {
          ajuste_diseno?: Json
          cantidad: number
          cotizacion_id: string
          creado_en?: string
          descuento_unitario?: number
          id?: string
          notas?: string | null
          opciones?: Json
          precio_unitario?: number | null
          producto_id: string
          variante_id?: string | null
        }
        Update: {
          ajuste_diseno?: Json
          cantidad?: number
          cotizacion_id?: string
          creado_en?: string
          descuento_unitario?: number
          id?: string
          notas?: string | null
          opciones?: Json
          precio_unitario?: number | null
          producto_id?: string
          variante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_items_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizacion_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizacion_items_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          acepta_terminos: boolean
          acepta_terminos_en: string
          actualizado_en: string
          cliente_email: string | null
          cliente_nombre: string
          cliente_telefono: string
          codigo: string
          creado_en: string
          descuento: number
          direccion: string | null
          entrega: string
          estado: string
          id: string
          moneda: string
          notas_cliente: string | null
          notas_internas: string | null
          subtotal: number | null
          token_publico: string
          total: number | null
          vence_en: string | null
          version_terminos: string | null
        }
        Insert: {
          acepta_terminos: boolean
          acepta_terminos_en?: string
          actualizado_en?: string
          cliente_email?: string | null
          cliente_nombre: string
          cliente_telefono: string
          codigo?: string
          creado_en?: string
          descuento?: number
          direccion?: string | null
          entrega?: string
          estado?: string
          id?: string
          moneda?: string
          notas_cliente?: string | null
          notas_internas?: string | null
          subtotal?: number | null
          token_publico?: string
          total?: number | null
          vence_en?: string | null
          version_terminos?: string | null
        }
        Update: {
          acepta_terminos?: boolean
          acepta_terminos_en?: string
          actualizado_en?: string
          cliente_email?: string | null
          cliente_nombre?: string
          cliente_telefono?: string
          codigo?: string
          creado_en?: string
          descuento?: number
          direccion?: string | null
          entrega?: string
          estado?: string
          id?: string
          moneda?: string
          notas_cliente?: string | null
          notas_internas?: string | null
          subtotal?: number | null
          token_publico?: string
          total?: number | null
          vence_en?: string | null
          version_terminos?: string | null
        }
        Relationships: []
      }
      disenos: {
        Row: {
          alto: number | null
          ancho: number | null
          bytes: number | null
          cara: string
          creado_en: string
          id: string
          item_id: string
          mime: string
          ruta: string
          tipo: string
        }
        Insert: {
          alto?: number | null
          ancho?: number | null
          bytes?: number | null
          cara?: string
          creado_en?: string
          id?: string
          item_id: string
          mime: string
          ruta: string
          tipo: string
        }
        Update: {
          alto?: number | null
          ancho?: number | null
          bytes?: number | null
          cara?: string
          creado_en?: string
          id?: string
          item_id?: string
          mime?: string
          ruta?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "disenos_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "cotizacion_items"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          creado_en: string
          id: string
          nombre: string | null
          rol: string
        }
        Insert: {
          creado_en?: string
          id: string
          nombre?: string | null
          rol?: string
        }
        Update: {
          creado_en?: string
          id?: string
          nombre?: string | null
          rol?: string
        }
        Relationships: []
      }
      precios: {
        Row: {
          actualizado_en: string
          cantidad_min: number
          id: string
          precio_unitario: number
          variante_id: string
        }
        Insert: {
          actualizado_en?: string
          cantidad_min: number
          id?: string
          precio_unitario: number
          variante_id: string
        }
        Update: {
          actualizado_en?: string
          cantidad_min?: number
          id?: string
          precio_unitario?: number
          variante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "precios_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean
          actualizado_en: string
          config_visor: Json
          creado_en: string
          descripcion: string | null
          id: string
          imagen_ruta: string | null
          nombre: string
          orden: number
          slug: string
          tipo_visor: string
        }
        Insert: {
          activo?: boolean
          actualizado_en?: string
          config_visor?: Json
          creado_en?: string
          descripcion?: string | null
          id?: string
          imagen_ruta?: string | null
          nombre: string
          orden?: number
          slug: string
          tipo_visor: string
        }
        Update: {
          activo?: boolean
          actualizado_en?: string
          config_visor?: Json
          creado_en?: string
          descripcion?: string | null
          id?: string
          imagen_ruta?: string | null
          nombre?: string
          orden?: number
          slug?: string
          tipo_visor?: string
        }
        Relationships: []
      }
      promociones: {
        Row: {
          activa: boolean
          actualizado_en: string
          cantidad_min: number
          codigo: string | null
          creado_en: string
          descripcion: string | null
          id: string
          inicia_en: string | null
          nombre: string
          producto_id: string | null
          termina_en: string | null
          tipo: string
          valor: number
          variante_id: string | null
        }
        Insert: {
          activa?: boolean
          actualizado_en?: string
          cantidad_min?: number
          codigo?: string | null
          creado_en?: string
          descripcion?: string | null
          id?: string
          inicia_en?: string | null
          nombre: string
          producto_id?: string | null
          termina_en?: string | null
          tipo: string
          valor: number
          variante_id?: string | null
        }
        Update: {
          activa?: boolean
          actualizado_en?: string
          cantidad_min?: number
          codigo?: string | null
          creado_en?: string
          descripcion?: string | null
          id?: string
          inicia_en?: string | null
          nombre?: string
          producto_id?: string | null
          termina_en?: string | null
          tipo?: string
          valor?: number
          variante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promociones_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promociones_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          activo: boolean
          actualizado_en: string
          creado_en: string
          descripcion: string | null
          icono: string | null
          id: string
          imagen_ruta: string | null
          orden: number
          precio_desde: number | null
          slug: string
          titulo: string
        }
        Insert: {
          activo?: boolean
          actualizado_en?: string
          creado_en?: string
          descripcion?: string | null
          icono?: string | null
          id?: string
          imagen_ruta?: string | null
          orden?: number
          precio_desde?: number | null
          slug: string
          titulo: string
        }
        Update: {
          activo?: boolean
          actualizado_en?: string
          creado_en?: string
          descripcion?: string | null
          icono?: string | null
          id?: string
          imagen_ruta?: string | null
          orden?: number
          precio_desde?: number | null
          slug?: string
          titulo?: string
        }
        Relationships: []
      }
      trabajo_imagenes: {
        Row: {
          alt: string
          alto: number | null
          ancho: number | null
          creado_en: string
          es_portada: boolean
          id: string
          orden: number
          ruta: string
          trabajo_id: string
        }
        Insert: {
          alt?: string
          alto?: number | null
          ancho?: number | null
          creado_en?: string
          es_portada?: boolean
          id?: string
          orden?: number
          ruta: string
          trabajo_id: string
        }
        Update: {
          alt?: string
          alto?: number | null
          ancho?: number | null
          creado_en?: string
          es_portada?: boolean
          id?: string
          orden?: number
          ruta?: string
          trabajo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajo_imagenes_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id"]
          },
        ]
      }
      trabajos: {
        Row: {
          actualizado_en: string
          creado_en: string
          descripcion: string | null
          destacado: boolean
          etiquetas: string[]
          fecha_trabajo: string | null
          id: string
          orden: number
          producto_id: string | null
          publicado: boolean
          slug: string
          titulo: string
        }
        Insert: {
          actualizado_en?: string
          creado_en?: string
          descripcion?: string | null
          destacado?: boolean
          etiquetas?: string[]
          fecha_trabajo?: string | null
          id?: string
          orden?: number
          producto_id?: string | null
          publicado?: boolean
          slug: string
          titulo: string
        }
        Update: {
          actualizado_en?: string
          creado_en?: string
          descripcion?: string | null
          destacado?: boolean
          etiquetas?: string[]
          fecha_trabajo?: string | null
          id?: string
          orden?: number
          producto_id?: string | null
          publicado?: boolean
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      variantes: {
        Row: {
          activo: boolean
          actualizado_en: string
          atributos: Json
          creado_en: string
          id: string
          material: string | null
          nombre: string
          orden: number
          producto_id: string
        }
        Insert: {
          activo?: boolean
          actualizado_en?: string
          atributos?: Json
          creado_en?: string
          id?: string
          material?: string | null
          nombre: string
          orden?: number
          producto_id: string
        }
        Update: {
          activo?: boolean
          actualizado_en?: string
          atributos?: Json
          creado_en?: string
          id?: string
          material?: string | null
          nombre?: string
          orden?: number
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variantes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_precio: {
        Args: { p_cantidad: number; p_variante: string }
        Returns: {
          descuento_unitario: number
          precio_base: number
          precio_final: number
          promocion_id: string
        }[]
      }
      es_admin: { Args: never; Returns: boolean }
      precios_visibles: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
