package com.billetera.backend.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MindicadorResponseDTO {

    @JsonProperty("version")
    private String version;

    @JsonProperty("autor")
    private String autor;

    @JsonProperty("fecha")
    private String fecha;

    @JsonProperty("uf")
    private IndicatorData uf;

    @JsonProperty("dolar")
    private IndicatorData dolar;

    @JsonProperty("euro")
    private IndicatorData euro;

    @Data
    public static class IndicatorData {
        @JsonProperty("codigo")
        private String codigo;

        @JsonProperty("nombre")
        private String nombre;

        @JsonProperty("unidad_medida")
        private String unidadMedida;

        @JsonProperty("fecha")
        private String fecha;

        @JsonProperty("valor")
        private BigDecimal valor;

        @JsonProperty("serie")
        private List<SerieData> serie;
    }

    @Data
    public static class SerieData {
        @JsonProperty("fecha")
        private String fecha;

        @JsonProperty("valor")
        private BigDecimal valor;
    }
}