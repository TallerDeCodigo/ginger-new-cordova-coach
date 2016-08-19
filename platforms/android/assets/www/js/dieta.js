(function($){

  "use strict";

  $(function(){
console.log('Hola desde dieta');

var json = '{
  "_id": "54f3c3cf4b6614a8119e70b3",
  "creado": "2015-03-02T01:58:39.944Z",
  "nombre": "Michelle Ronay 1.xlsx",
  "coach": "54f3c16f4b6614a8119e6439",
  "estructura": {
    "martes": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e706e"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e706f"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7070"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a4",
            "platillo": "54f3c3cf4b6614a8119e7071"
          }
        },
        "4": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a5",
            "platillo": "54f3c3cf4b6614a8119e7072"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7073"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a0",
            "platillo": "54f3c3cf4b6614a8119e7064"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a6",
            "platillo": "54f3c3cf4b6614a8119e7074"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7075"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a4",
            "platillo": "54f3c3cf4b6614a8119e7071"
          }
        }
      }
    },
    "jueves": {
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7080"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7081"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70aa",
            "platillo": "54f3c3cf4b6614a8119e7082"
          }
        },
        "4": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70ab",
            "platillo": "54f3c3cf4b6614a8119e7083"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7084"
          }
        }
      },
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        },
        "4": {
          "a": {
            "receta": "Coce el betabel, rebana muy fino, vierte un poco de aceite de oliva y agrega sal y pimienta al gusto",
            "platillo": "54f3c3cf4b6614a8119e707c",
            "descripcion": "Carpaccio de betabel"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e707f"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7076"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70ac",
            "platillo": "54f3c3cf4b6614a8119e7085"
          }
        }
      }
    },
    "viernes": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7086"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e707c"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7087"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70ad",
            "platillo": "54f3c3cf4b6614a8119e7088"
          },
          "b": {
            "comentario": "54f3c3cf4b6614a8119e70ae",
            "platillo": "54f3c3cf4b6614a8119e7089"
          }
        },
        "4": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e708a"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e708b"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70af",
            "platillo": "54f3c3cf4b6614a8119e708c"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e708d"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e708e"
          }
        }
      }
    },
    "sabado": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e706e"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e708f"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7090"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7091"
          }
        },
        "3": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7092"
          }
        },
        "4": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7093"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7094"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70b0",
            "platillo": "54f3c3cf4b6614a8119e7095"
          },
          "b": {
            "comentario": "54f3c3cf4b6614a8119e70b1",
            "platillo": "54f3c3cf4b6614a8119e7096"
          }
        }
      }
    },
    "miercoles": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7076"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7077"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7078"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a7",
            "platillo": "54f3c3cf4b6614a8119e7079"
          }
        },
        "4": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a8",
            "platillo": "54f3c3cf4b6614a8119e707a"
          },
          "b": {
            "comentario": "54f3c3cf4b6614a8119e70a9",
            "platillo": "54f3c3cf4b6614a8119e707b"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e706e"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e707c"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e707d"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e707e"
          }
        }
      }
    },
    "lunes": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a0",
            "platillo": "54f3c3cf4b6614a8119e7064"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7066"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7067"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a1",
            "platillo": "54f3c3cf4b6614a8119e7068"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7069"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e706a"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a2",
            "platillo": "54f3c3cf4b6614a8119e706b"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e706c"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a3",
            "platillo": "54f3c3cf4b6614a8119e706d"
          }
        }
      }
    },
    "domingo": {
      "desayuno": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709d",
            "platillo": "54f3c3cf4b6614a8119e7061"
          }
        },
        "2": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709e",
            "platillo": "54f3c3cf4b6614a8119e7062"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e709f",
            "platillo": "54f3c3cf4b6614a8119e7063"
          }
        }
      },
      "snack1": {
        "1": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70a0",
            "platillo": "54f3c3cf4b6614a8119e7064"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "comida": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7097"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7098"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e7099"
          }
        },
        "3": {
          "a": {
            "comentario": "54f3c3cf4b6614a8119e70b2",
            "platillo": "54f3c3cf4b6614a8119e709a"
          }
        },
        "4": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7093"
          }
        }
      },
      "snack2": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e707f"
          }
        },
        "2": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e7065"
          }
        }
      },
      "cena": {
        "1": {
          "a": {
            "platillo": "54f3c3cf4b6614a8119e709b"
          },
          "b": {
            "platillo": "54f3c3cf4b6614a8119e709c"
          }
        }
      }
    }
  },
  "__v": 1,
  "modificado": "2016-07-21T18:06:22.000Z",
  "calificaciones": 16,
  "aprobada": false,
  "custom": false,
  "puntos": 56,
  "softDelete": false,
  "comodin": false,
  "publica": false,
  "comentarios": [
    {
      "_id": "54f3c3cf4b6614a8119e709d",
      "comment": "Procura tomarlo en ayunas al menos 20 minutos antes de otros alimentos",
      "plato": "54f3c3cf4b6614a8119e7061"
    },
    {
      "_id": "54f3c3cf4b6614a8119e709e",
      "comment": "Puedes intercambiar los smoothies entre los días de la semana.",
      "plato": "54f3c3cf4b6614a8119e7062"
    },
    {
      "_id": "54f3c3cf4b6614a8119e709f",
      "comment": "O té verde",
      "plato": "54f3c3cf4b6614a8119e7063"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a4",
      "comment": "Sin aceite ni azúcar",
      "plato": "54f3c3cf4b6614a8119e7071"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a5",
      "comment": "Procura usar pollo orgánico, o si no kosher",
      "plato": "54f3c3cf4b6614a8119e7072"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a0",
      "comment": "Busca marcas orgánicas o naturales sin aditivos, por ejemplo Nuts & Co. No más de 2 cucharadas de almond butter",
      "plato": "54f3c3cf4b6614a8119e7064"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a6",
      "comment": "75 gramos de salmón",
      "plato": "54f3c3cf4b6614a8119e7074"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70aa",
      "comment": "Puedes ponerle kale, pepino, apio, acelga, lechuga, ejotes, espárragos, pimiento verde, cebollin, alcachofa, espinaca, berros…",
      "plato": "54f3c3cf4b6614a8119e7082"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70ab",
      "comment": "Agregale cilantro, cebolla y betabel para que sea súper detox.",
      "plato": "54f3c3cf4b6614a8119e7083"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70ac",
      "comment": "1 taza de lenteja máximo",
      "plato": "54f3c3cf4b6614a8119e7085"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70ad",
      "comment": "Puedes usar hasta 1 taza de arroz.",
      "plato": "54f3c3cf4b6614a8119e7088"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70ae",
      "comment": "Puedes usar hasta 1 taza de arroz.",
      "plato": "54f3c3cf4b6614a8119e7089"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70af",
      "comment": "Procura usar huevo orgánico",
      "plato": "54f3c3cf4b6614a8119e708c"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70b0",
      "comment": "Usa salsa Tamari, o intenta reducir tu consumo de soya",
      "plato": "54f3c3cf4b6614a8119e7095"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70b1",
      "comment": "Usa salsa Tamari, o intenta reducir tu consumo de soya",
      "plato": "54f3c3cf4b6614a8119e7096"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a7",
      "comment": "Sin aceite ni azúcar",
      "plato": "54f3c3cf4b6614a8119e7079"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a8",
      "comment": "Procura comer pescado salvaje, nunca de granja (por ejemplo, no blanco de nilo)",
      "plato": "54f3c3cf4b6614a8119e707a"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a9",
      "comment": "Preparalo sin aceites ni azúcar",
      "plato": "54f3c3cf4b6614a8119e707b"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a1",
      "comment": "No comas salmón de granja, únicamente salmón salvaje.",
      "plato": "54f3c3cf4b6614a8119e7068"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a2",
      "comment": "Puedes otras opciones sin ingredientes añadidos y sin freir.",
      "plato": "54f3c3cf4b6614a8119e706b"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70a3",
      "comment": "Aderezo sin mayonesa y sin azúcar",
      "plato": "54f3c3cf4b6614a8119e706d"
    },
    {
      "_id": "54f3c3cf4b6614a8119e70b2",
      "comment": "Sin queso",
      "plato": "54f3c3cf4b6614a8119e709a"
    }
  ],
  "platillos": [
    {
      "_id": "54f3c3cf4b6614a8119e7061",
      "descripcion": "1 vaso grande de agua caliente con limón",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7062",
      "descripcion": "Smoothie",
      "receta": "1/2 taza de agua, 1/2 taza de agua de coco, 1/2 taza kale, 1/2 pepino, 1/2 taza de melon verde, un puño de hierbabuena o menta, 1 cu chia, 1 cu hemp y una pizca de curcuma, puedes agregar limón al gusto. Licuar todo y tomar de inmediato",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7063",
      "descripcion": "Una taza de Tessai",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706e",
      "descripcion": "Un pan Ezekiel con 1/4 de aguacate",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        1,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7065",
      "descripcion": "Verduras libres",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        1,
        2,
        2,
        2,
        1,
        2
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706f",
      "descripcion": "Champiñones rellenos de su tallo",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7070",
      "descripcion": "Sopa de betabel",
      "receta": "Hierve el betabel con 1/4 cebolla y unas zanahorias. Una vez hervido deja a fuego lento unos 20 mins. Licua todo, agrega cilantro fresco y sirve.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7071",
      "descripcion": "Ensalada libre",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        2,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7072",
      "descripcion": "Tinga de 150 gramos de pollo y dos tortillas Ezekiel",
      "receta": "",
      "categorias": [
        1
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7073",
      "descripcion": "1 taza de lenteja con cebolla caramelizada, aderezada con pepino y eneldo.",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7064",
      "descripcion": "Tronquitos de apio con almond butter",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        1,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7074",
      "descripcion": "Conos de salmón sin arroz",
      "receta": "Agrega las verduras que quieras",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7075",
      "descripcion": "Cono de tofu sin arroz",
      "receta": "Agrega las verduras que quieras",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7080",
      "descripcion": "Ensalada de nopales a la mexicana",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7081",
      "descripcion": "Sopa de verduras picadas",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7082",
      "descripcion": "Ensalada de puros verdes",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7083",
      "descripcion": "180 gramos de ceviche de pescado con dos paquetes de salmas",
      "receta": "",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7084",
      "descripcion": "Ensalada de quinoa y alcachofa",
      "receta": "Dora 1/2 taza de cebolla morada en aceite de oliva. Agrega 1 taza de corazones de alcachofa y deja reposar durante 2 minutos. Agrega 1 taza de quinoa con 2 tazas de agua y cubre hasta que el agua de evapore. Retira del fuego, añade perejil y jugo de dos limones.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707c",
      "descripcion": "Carpaccio de betabel",
      "receta": "Coce el betabel, rebana muy fino, vierte un poco de aceite de oliva y agrega sal y pimienta al gusto",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        1,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707f",
      "descripcion": "Camote chips",
      "receta": "Precalienta el horno a 180º. Corta el camote en rodajas finas. Engrasa ligeramente la charola y acomoda el camote sin que se toque. Mezcla un poco de aceite de oliva con sal, pimienta y romero. Untale la mezcla al camote y hornea de 8 a 13 mins.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7076",
      "descripcion": "1/2 taza de nuez de la india",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7085",
      "descripcion": "Jitomates rellenos de ensalada de lenteja",
      "receta": "Coce la lenteja con cebolla, deja enfriar. Ahueca los jitomates y rellenalos con la lenteja.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        1,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7086",
      "descripcion": "Kale chips",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7087",
      "descripcion": "Espárragos a la parilla con vinagre balsámico",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7088",
      "descripcion": "Sushi de salmón",
      "receta": "Encima del alga coloca el arroz, rellena de salmón, y agrega las verduras que quieras",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7089",
      "descripcion": "Sushi vegano",
      "receta": "Encima del alga coloca el arroz, y agrega las verduras que quieras",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708a",
      "descripcion": "Ensalada de lechuga, apio, jitomate, cebolla y chayote cocido con aderezo de limón",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708b",
      "descripcion": "1 tortilla Ezekiel rellena de tahini con 1 cu miel",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708c",
      "descripcion": "2 huevos revueltos a la mexicana con una tortilla o pan Ezekiel",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708d",
      "descripcion": "Tofu revuelto a la mexicana con una tortilla o pan Ezekiel",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708e",
      "descripcion": "Calabacitas a la parrila",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        1,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e708f",
      "descripcion": "Sopa de lenteja",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7090",
      "descripcion": "Carpaccio de res",
      "receta": "",
      "categorias": [
        5
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7091",
      "descripcion": "Carpaccio de alcachofa",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7092",
      "descripcion": "Ensalada verde y/o verduras a la parrilla",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7093",
      "descripcion": "Una taza de arroz, o 2 tortillas, o 2 paquetes salmas",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7094",
      "descripcion": "Kale chips + 12 almendras",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7095",
      "descripcion": "Tepanyaki de 75 gramos de pescado blanco con verduras",
      "receta": "",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7096",
      "descripcion": "Tepanyaki de 75 gramos de tofu con verduras",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7077",
      "descripcion": "Chayotes al horno",
      "receta": "Cocelos, sacales el relleno y el relleno hazlo pure junto con cebolla cocida. Vuelve a rellenarlos con el pure y hornea",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7078",
      "descripcion": "Sopa de champiñon",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7079",
      "descripcion": "Ensalada de corazones de alcachofa con verduras libres y 1/2 taza de arroz integral",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707a",
      "descripcion": "Tacos de lechuga rellenos de 150 gramos de pescado",
      "receta": "",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707b",
      "descripcion": "Tacos de lechuga rellenos de 150 gramos de tofu preparado",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707d",
      "descripcion": "Ensalada verde con una lata de atún y un paquete de salmas",
      "receta": "",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e707e",
      "descripcion": "Ensalada verde con media taza de quinoa cocida",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7066",
      "descripcion": "Ensalada de espinaca, jitomate y cebolla",
      "receta": "Adereza con limón, salsa tamari y vinagre de manzana.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7067",
      "descripcion": "Sopa de brocoli",
      "receta": "Coce el brocoli unos 15 minutos junto con 1/4 cebolla; licúa todo junto y sirve de inmediato",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7068",
      "descripcion": "Tacos de 150 gramos de salmón al horno con salsa de limón, ajo y miel, en tres tortillas germinadas o Ezekiel",
      "receta": "Licua el jugo de dos limones, con 1 diente de ajo grande, 1 cu miel. En un pyrex coloca el salmón y vierte la salsa encima. Hornea 20-25 minutos a 180ºC.",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7069",
      "descripcion": "Una taza de Quinoa con Edamame",
      "receta": "Coce la quinoa y el edamame, agrega perejil, jitomate y cebolla y adereza con vinagre balsamico y limón.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706a",
      "descripcion": "Pure de camote con ajonjoli",
      "receta": "Coce el camote, aplastalo y revuelve con 1 cu miel orgánica y 2 cu ajonjoli.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706b",
      "descripcion": "Ensalada de atún con un paquete de salmas",
      "receta": "Una lata preparada con mayonesa (o aceite de oliva), limón, jitomate, cebolla y perejil",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706c",
      "descripcion": "Ensalada de 1 taza de quinoa a la mexicana",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e706d",
      "descripcion": "Una alcachofa",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7097",
      "descripcion": "Sopa de tomate",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7098",
      "descripcion": "Ensalada con atún sellado",
      "receta": "",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e7099",
      "descripcion": "Ensalada con tofu",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e709a",
      "descripcion": "Espárragos a la parrilla",
      "receta": "",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e709b",
      "descripcion": "Tacos de champiñon, calabacita, rajas y atún en hojas de lechuga (menos una tortilla Ezekiel o de nopal)",
      "receta": "En un sartén, dora todos los ingredientes picados junto con el atún en un poco de salsa tamari, limón y aceite de oliva. Coloca en las lechugas, menos uno que puedes comer en tortilla Ezekiel o de nopal.",
      "categorias": [
        2
      ],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    },
    {
      "_id": "54f3c3cf4b6614a8119e709c",
      "descripcion": "Tacos de champiñon, calabacitas, rajasy frijoles en hojas de lechuga",
      "receta": "En un sartén, dora todos los ingredientes picados junto con el frijol en un poco de salsa tamari, limón y aceite de oliva. Coloca en las lechugas.",
      "categorias": [],
      "ingredientes": [],
      "frecuencia": [
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ]
    }
  ],
  "duracion": 7,
  "restricciones": [
    0,
    1,
    2,
    3,
    4,
    5
  ],
  "perfil": {
    "objetivo": [
      1
    ],
    "ejercicio": [
      0,
      1
    ],
    "bmi": [
      0
    ],
    "edad": [
      0
    ],
    "sexo": [
      0
    ]
  },
  "rating": 3.5,
  "id": "54f3c3cf4b6614a8119e70b3"
}';


var obj = JSON.parse(json);


var estructura = obj.estructura.lunes.desayuno.1.a;

console.log(estructura);


})(jQuery);