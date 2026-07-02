import { Booking } from '../types/booking.types';

export const bookingsMock: Booking[] = [
  {
    "id": "bkg_1",
    "professionalId": "prof_20",
    "client": {
      "id": "cli_21",
      "name": "Ana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=AnaCliente",
      "phone": "11976661382",
      "email": "anacliente@email.com",
      "totalBookings": 1,
      "lastVisit": "2026-06-17T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_94ro98s",
        "professionalId": "prof_20",
        "name": "Podologia Preventiva",
        "category": "podologa",
        "description": "Serviço de Podologia Preventiva com produtos de alta qualidade.",
        "duration": 30,
        "price": 137,
        "images": [
          "https://picsum.photos/seed/lwac209/400/400"
        ]
      }
    ],
    "date": "2026-06-22",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pix",
    "totalPrice": 137,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_2",
    "professionalId": "prof_12",
    "client": {
      "id": "cli_22",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11981661530",
      "email": "beatrizcliente@email.com",
      "totalBookings": 13,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_e6pn246",
        "professionalId": "prof_12",
        "name": "Maquiagem Artística",
        "category": "maquiagem",
        "description": "Serviço de Maquiagem Artística com produtos de alta qualidade.",
        "duration": 80,
        "price": 58,
        "images": [
          "https://picsum.photos/seed/eaqczb8/400/400"
        ]
      }
    ],
    "date": "2026-07-11",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "pix",
    "totalPrice": 58,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_3",
    "professionalId": "prof_1",
    "client": {
      "id": "cli_13",
      "name": "Yasmin Cliente",
      "avatar": "https://i.pravatar.cc/150?u=YasminCliente",
      "phone": "11979197300",
      "email": "yasmincliente@email.com",
      "totalBookings": 4,
      "lastVisit": "2026-06-06T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_77xnty6",
        "professionalId": "prof_1",
        "name": "Limpeza de Pele",
        "category": "esteticista",
        "description": "Serviço de Limpeza de Pele com produtos de alta qualidade.",
        "duration": 110,
        "price": 40,
        "images": [
          "https://picsum.photos/seed/t8197ku/400/400"
        ]
      }
    ],
    "date": "2026-07-01",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pago_online",
    "totalPrice": 40,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_4",
    "professionalId": "prof_3",
    "client": {
      "id": "cli_3",
      "name": "Juliana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=JulianaCliente",
      "phone": "11952352338",
      "email": "julianacliente@email.com",
      "totalBookings": 6,
      "lastVisit": "2026-06-24T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_lr59tl6",
        "professionalId": "prof_3",
        "name": "Tratamento de Unha Encravada",
        "category": "podologa",
        "description": "Serviço de Tratamento de Unha Encravada com produtos de alta qualidade.",
        "duration": 70,
        "price": 227,
        "images": [
          "https://picsum.photos/seed/0ro50i5/400/400"
        ]
      }
    ],
    "date": "2026-07-09",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "pix",
    "totalPrice": 227,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_5",
    "professionalId": "prof_16",
    "client": {
      "id": "cli_19",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11991748859",
      "email": "vitoriacliente@email.com",
      "totalBookings": 15,
      "lastVisit": "2026-06-06T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_bfh5yw6",
        "professionalId": "prof_16",
        "name": "Spa dos Pés",
        "category": "pedicure",
        "description": "Serviço de Spa dos Pés com produtos de alta qualidade.",
        "duration": 50,
        "price": 45,
        "images": [
          "https://picsum.photos/seed/1mbk3eo/400/400"
        ]
      }
    ],
    "date": "2026-06-26",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "dinheiro",
    "totalPrice": 45,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_6",
    "professionalId": "prof_5",
    "client": {
      "id": "cli_14",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11983469026",
      "email": "beatrizcliente@email.com",
      "totalBookings": 13,
      "lastVisit": "2026-06-04T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_au7x5cm",
        "professionalId": "prof_5",
        "name": "Micropigmentação Labial",
        "category": "micropigmentacao",
        "description": "Serviço de Micropigmentação Labial com produtos de alta qualidade.",
        "duration": 110,
        "price": 72,
        "images": [
          "https://picsum.photos/seed/ioh4nz7/400/400"
        ]
      }
    ],
    "date": "2026-07-11",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "pix",
    "totalPrice": 72,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_7",
    "professionalId": "prof_6",
    "client": {
      "id": "cli_16",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11984887860",
      "email": "vitoriacliente@email.com",
      "totalBookings": 9,
      "lastVisit": "2026-06-12T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_vkgx0c9",
        "professionalId": "prof_6",
        "name": "Peeling",
        "category": "esteticista",
        "description": "Serviço de Peeling com produtos de alta qualidade.",
        "duration": 70,
        "price": 258,
        "images": [
          "https://picsum.photos/seed/psggypb/400/400"
        ]
      }
    ],
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "pago_online",
    "totalPrice": 258,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_8",
    "professionalId": "prof_10",
    "client": {
      "id": "cli_21",
      "name": "Ana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=AnaCliente",
      "phone": "11976661382",
      "email": "anacliente@email.com",
      "totalBookings": 1,
      "lastVisit": "2026-06-17T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_rq8lfpf",
        "professionalId": "prof_10",
        "name": "Peeling",
        "category": "esteticista",
        "description": "Serviço de Peeling com produtos de alta qualidade.",
        "duration": 90,
        "price": 65,
        "images": [
          "https://picsum.photos/seed/617p95a/400/400"
        ]
      }
    ],
    "date": "2026-07-07",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "pago_online",
    "totalPrice": 65,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_9",
    "professionalId": "prof_8",
    "client": {
      "id": "cli_13",
      "name": "Yasmin Cliente",
      "avatar": "https://i.pravatar.cc/150?u=YasminCliente",
      "phone": "11979197300",
      "email": "yasmincliente@email.com",
      "totalBookings": 4,
      "lastVisit": "2026-06-06T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_ijq2b7s",
        "professionalId": "prof_8",
        "name": "Luzes/Mechas",
        "category": "cabeleireira",
        "description": "Serviço de Luzes/Mechas com produtos de alta qualidade.",
        "duration": 80,
        "price": 201,
        "images": [
          "https://picsum.photos/seed/5y24wkl/400/400"
        ]
      }
    ],
    "date": "2026-07-06",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "cartao",
    "totalPrice": 201,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_10",
    "professionalId": "prof_10",
    "client": {
      "id": "cli_22",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11981661530",
      "email": "beatrizcliente@email.com",
      "totalBookings": 13,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_l11d637",
        "professionalId": "prof_10",
        "name": "Pedras Quentes",
        "category": "massoterapia",
        "description": "Serviço de Pedras Quentes com produtos de alta qualidade.",
        "duration": 40,
        "price": 129,
        "images": [
          "https://picsum.photos/seed/jai3yck/400/400"
        ]
      }
    ],
    "date": "2026-07-06",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "cartao",
    "totalPrice": 129,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_11",
    "professionalId": "prof_17",
    "client": {
      "id": "cli_23",
      "name": "Quintina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=QuintinaCliente",
      "phone": "11989676021",
      "email": "quintinacliente@email.com",
      "totalBookings": 19,
      "lastVisit": "2026-06-15T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_tg02abn",
        "professionalId": "prof_17",
        "name": "Massagem Modeladora",
        "category": "massoterapia",
        "description": "Serviço de Massagem Modeladora com produtos de alta qualidade.",
        "duration": 80,
        "price": 94,
        "images": [
          "https://picsum.photos/seed/e6skeml/400/400"
        ]
      }
    ],
    "date": "2026-07-11",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "dinheiro",
    "totalPrice": 94,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_12",
    "professionalId": "prof_10",
    "client": {
      "id": "cli_6",
      "name": "Paula Cliente",
      "avatar": "https://i.pravatar.cc/150?u=PaulaCliente",
      "phone": "11960824926",
      "email": "paulacliente@email.com",
      "totalBookings": 10,
      "lastVisit": "2026-06-17T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_l11d637",
        "professionalId": "prof_10",
        "name": "Pedras Quentes",
        "category": "massoterapia",
        "description": "Serviço de Pedras Quentes com produtos de alta qualidade.",
        "duration": 40,
        "price": 129,
        "images": [
          "https://picsum.photos/seed/jai3yck/400/400"
        ]
      }
    ],
    "date": "2026-07-11",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "pix",
    "totalPrice": 129,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_13",
    "professionalId": "prof_11",
    "client": {
      "id": "cli_18",
      "name": "Quintina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=QuintinaCliente",
      "phone": "11941385283",
      "email": "quintinacliente@email.com",
      "totalBookings": 17,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_njvzsim",
        "professionalId": "prof_11",
        "name": "Micropigmentação Labial",
        "category": "micropigmentacao",
        "description": "Serviço de Micropigmentação Labial com produtos de alta qualidade.",
        "duration": 90,
        "price": 258,
        "images": [
          "https://picsum.photos/seed/eacauof/400/400"
        ]
      }
    ],
    "date": "2026-07-07",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "cartao",
    "totalPrice": 258,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_14",
    "professionalId": "prof_8",
    "client": {
      "id": "cli_5",
      "name": "Sabrina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=SabrinaCliente",
      "phone": "11937898768",
      "email": "sabrinacliente@email.com",
      "totalBookings": 4,
      "lastVisit": "2026-06-29T01:32:58.045Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_qa0lkjb",
        "professionalId": "prof_8",
        "name": "Spa das Mãos",
        "category": "manicure",
        "description": "Serviço de Spa das Mãos com produtos de alta qualidade.",
        "duration": 120,
        "price": 199,
        "images": [
          "https://picsum.photos/seed/38wrd2u/400/400"
        ]
      }
    ],
    "date": "2026-06-22",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "cartao",
    "totalPrice": 199,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_15",
    "professionalId": "prof_19",
    "client": {
      "id": "cli_6",
      "name": "Paula Cliente",
      "avatar": "https://i.pravatar.cc/150?u=PaulaCliente",
      "phone": "11960824926",
      "email": "paulacliente@email.com",
      "totalBookings": 10,
      "lastVisit": "2026-06-17T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_7usksls",
        "professionalId": "prof_19",
        "name": "Manicure Clássica",
        "category": "manicure",
        "description": "Serviço de Manicure Clássica com produtos de alta qualidade.",
        "duration": 60,
        "price": 243,
        "images": [
          "https://picsum.photos/seed/26y5bxt/400/400"
        ]
      }
    ],
    "date": "2026-07-05",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pago_online",
    "totalPrice": 243,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_16",
    "professionalId": "prof_10",
    "client": {
      "id": "cli_2",
      "name": "Gabriela Cliente",
      "avatar": "https://i.pravatar.cc/150?u=GabrielaCliente",
      "phone": "11985764032",
      "email": "gabrielacliente@email.com",
      "totalBookings": 12,
      "lastVisit": "2026-06-04T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_hvnwe5k",
        "professionalId": "prof_10",
        "name": "Limpeza de Pele",
        "category": "esteticista",
        "description": "Serviço de Limpeza de Pele com produtos de alta qualidade.",
        "duration": 90,
        "price": 47,
        "images": [
          "https://picsum.photos/seed/qiz7yif/400/400"
        ]
      }
    ],
    "date": "2026-07-05",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "pix",
    "totalPrice": 47,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_17",
    "professionalId": "prof_6",
    "client": {
      "id": "cli_16",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11984887860",
      "email": "vitoriacliente@email.com",
      "totalBookings": 9,
      "lastVisit": "2026-06-12T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_preyn8f",
        "professionalId": "prof_6",
        "name": "Limpeza de Pele",
        "category": "esteticista",
        "description": "Serviço de Limpeza de Pele com produtos de alta qualidade.",
        "duration": 40,
        "price": 203,
        "images": [
          "https://picsum.photos/seed/q8np1b6/400/400"
        ]
      }
    ],
    "date": "2026-06-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "pago_online",
    "totalPrice": 203,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_18",
    "professionalId": "prof_11",
    "client": {
      "id": "cli_9",
      "name": "Natalia Cliente",
      "avatar": "https://i.pravatar.cc/150?u=NataliaCliente",
      "phone": "11966539449",
      "email": "nataliacliente@email.com",
      "totalBookings": 11,
      "lastVisit": "2026-07-01T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_njvzsim",
        "professionalId": "prof_11",
        "name": "Micropigmentação Labial",
        "category": "micropigmentacao",
        "description": "Serviço de Micropigmentação Labial com produtos de alta qualidade.",
        "duration": 90,
        "price": 258,
        "images": [
          "https://picsum.photos/seed/eacauof/400/400"
        ]
      }
    ],
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "pix",
    "totalPrice": 258,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_19",
    "professionalId": "prof_12",
    "client": {
      "id": "cli_24",
      "name": "Rafaela Cliente",
      "avatar": "https://i.pravatar.cc/150?u=RafaelaCliente",
      "phone": "11918449929",
      "email": "rafaelacliente@email.com",
      "totalBookings": 17,
      "lastVisit": "2026-06-24T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_jinxkn4",
        "professionalId": "prof_12",
        "name": "Maquiagem para Noivas",
        "category": "maquiagem",
        "description": "Serviço de Maquiagem para Noivas com produtos de alta qualidade.",
        "duration": 70,
        "price": 238,
        "images": [
          "https://picsum.photos/seed/1z5jqjl/400/400"
        ]
      }
    ],
    "date": "2026-06-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "pix",
    "totalPrice": 238,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_20",
    "professionalId": "prof_19",
    "client": {
      "id": "cli_4",
      "name": "Mariana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=MarianaCliente",
      "phone": "11992909058",
      "email": "marianacliente@email.com",
      "totalBookings": 14,
      "lastVisit": "2026-06-02T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_ft1wxzc",
        "professionalId": "prof_19",
        "name": "Esmaltação em Gel",
        "category": "manicure",
        "description": "Serviço de Esmaltação em Gel com produtos de alta qualidade.",
        "duration": 40,
        "price": 31,
        "images": [
          "https://picsum.photos/seed/fzqcu48/400/400"
        ]
      }
    ],
    "date": "2026-07-06",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pix",
    "totalPrice": 31,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_21",
    "professionalId": "prof_11",
    "client": {
      "id": "cli_10",
      "name": "Helena Cliente",
      "avatar": "https://i.pravatar.cc/150?u=HelenaCliente",
      "phone": "11920024319",
      "email": "helenacliente@email.com",
      "totalBookings": 18,
      "lastVisit": "2026-06-22T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_c8sye3k",
        "professionalId": "prof_11",
        "name": "Microblading Fio a Fio",
        "category": "micropigmentacao",
        "description": "Serviço de Microblading Fio a Fio com produtos de alta qualidade.",
        "duration": 40,
        "price": 265,
        "images": [
          "https://picsum.photos/seed/g3917wf/400/400"
        ]
      }
    ],
    "date": "2026-06-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pago_online",
    "totalPrice": 265,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_22",
    "professionalId": "prof_1",
    "client": {
      "id": "cli_16",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11984887860",
      "email": "vitoriacliente@email.com",
      "totalBookings": 9,
      "lastVisit": "2026-06-12T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_154pa61",
        "professionalId": "prof_1",
        "name": "Peeling",
        "category": "esteticista",
        "description": "Serviço de Peeling com produtos de alta qualidade.",
        "duration": 80,
        "price": 237,
        "images": [
          "https://picsum.photos/seed/fowydrt/400/400"
        ]
      }
    ],
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "dinheiro",
    "totalPrice": 237,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_23",
    "professionalId": "prof_19",
    "client": {
      "id": "cli_6",
      "name": "Paula Cliente",
      "avatar": "https://i.pravatar.cc/150?u=PaulaCliente",
      "phone": "11960824926",
      "email": "paulacliente@email.com",
      "totalBookings": 10,
      "lastVisit": "2026-06-17T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_rkcjooa",
        "professionalId": "prof_19",
        "name": "Spa das Mãos",
        "category": "manicure",
        "description": "Serviço de Spa das Mãos com produtos de alta qualidade.",
        "duration": 120,
        "price": 292,
        "images": [
          "https://picsum.photos/seed/43zv4s4/400/400"
        ]
      }
    ],
    "date": "2026-07-12",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "cartao",
    "totalPrice": 292,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_24",
    "professionalId": "prof_16",
    "client": {
      "id": "cli_23",
      "name": "Quintina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=QuintinaCliente",
      "phone": "11989676021",
      "email": "quintinacliente@email.com",
      "totalBookings": 19,
      "lastVisit": "2026-06-15T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_7to1qsy",
        "professionalId": "prof_16",
        "name": "Massagem Relaxante",
        "category": "massoterapia",
        "description": "Serviço de Massagem Relaxante com produtos de alta qualidade.",
        "duration": 120,
        "price": 108,
        "images": [
          "https://picsum.photos/seed/zkwteh4/400/400"
        ]
      }
    ],
    "date": "2026-07-04",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "cartao",
    "totalPrice": 108,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_25",
    "professionalId": "prof_3",
    "client": {
      "id": "cli_1",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11973343003",
      "email": "vitoriacliente@email.com",
      "totalBookings": 1,
      "lastVisit": "2026-06-22T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_lr59tl6",
        "professionalId": "prof_3",
        "name": "Tratamento de Unha Encravada",
        "category": "podologa",
        "description": "Serviço de Tratamento de Unha Encravada com produtos de alta qualidade.",
        "duration": 70,
        "price": 227,
        "images": [
          "https://picsum.photos/seed/0ro50i5/400/400"
        ]
      }
    ],
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "pago_online",
    "totalPrice": 227,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_26",
    "professionalId": "prof_15",
    "client": {
      "id": "cli_23",
      "name": "Quintina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=QuintinaCliente",
      "phone": "11989676021",
      "email": "quintinacliente@email.com",
      "totalBookings": 19,
      "lastVisit": "2026-06-15T01:32:58.046Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_stbhsh7",
        "professionalId": "prof_15",
        "name": "Extensão Fio a Fio",
        "category": "lash_designer",
        "description": "Serviço de Extensão Fio a Fio com produtos de alta qualidade.",
        "duration": 30,
        "price": 169,
        "images": [
          "https://picsum.photos/seed/gj15yb8/400/400"
        ]
      }
    ],
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "pago_online",
    "totalPrice": 169,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_27",
    "professionalId": "prof_1",
    "client": {
      "id": "cli_3",
      "name": "Juliana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=JulianaCliente",
      "phone": "11952352338",
      "email": "julianacliente@email.com",
      "totalBookings": 6,
      "lastVisit": "2026-06-24T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_154pa61",
        "professionalId": "prof_1",
        "name": "Peeling",
        "category": "esteticista",
        "description": "Serviço de Peeling com produtos de alta qualidade.",
        "duration": 80,
        "price": 237,
        "images": [
          "https://picsum.photos/seed/fowydrt/400/400"
        ]
      }
    ],
    "date": "2026-07-11",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "pago_online",
    "totalPrice": 237,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_28",
    "professionalId": "prof_15",
    "client": {
      "id": "cli_15",
      "name": "Zelia Cliente",
      "avatar": "https://i.pravatar.cc/150?u=ZeliaCliente",
      "phone": "11918862148",
      "email": "zeliacliente@email.com",
      "totalBookings": 2,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_z9v7knn",
        "professionalId": "prof_15",
        "name": "Esmaltação em Gel",
        "category": "manicure",
        "description": "Serviço de Esmaltação em Gel com produtos de alta qualidade.",
        "duration": 30,
        "price": 40,
        "images": [
          "https://picsum.photos/seed/t0svkzg/400/400"
        ]
      }
    ],
    "date": "2026-06-25",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pix",
    "totalPrice": 40,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_29",
    "professionalId": "prof_7",
    "client": {
      "id": "cli_4",
      "name": "Mariana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=MarianaCliente",
      "phone": "11992909058",
      "email": "marianacliente@email.com",
      "totalBookings": 14,
      "lastVisit": "2026-06-02T01:32:58.045Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_302lhl8",
        "professionalId": "prof_7",
        "name": "Massagem Modeladora",
        "category": "massoterapia",
        "description": "Serviço de Massagem Modeladora com produtos de alta qualidade.",
        "duration": 50,
        "price": 89,
        "images": [
          "https://picsum.photos/seed/wq7gxqw/400/400"
        ]
      }
    ],
    "date": "2026-06-22",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "cartao",
    "totalPrice": 89,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_30",
    "professionalId": "prof_5",
    "client": {
      "id": "cli_12",
      "name": "Isabela Cliente",
      "avatar": "https://i.pravatar.cc/150?u=IsabelaCliente",
      "phone": "11996464934",
      "email": "isabelacliente@email.com",
      "totalBookings": 8,
      "lastVisit": "2026-07-01T01:32:58.045Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_au7x5cm",
        "professionalId": "prof_5",
        "name": "Micropigmentação Labial",
        "category": "micropigmentacao",
        "description": "Serviço de Micropigmentação Labial com produtos de alta qualidade.",
        "duration": 110,
        "price": 72,
        "images": [
          "https://picsum.photos/seed/ioh4nz7/400/400"
        ]
      }
    ],
    "date": "2026-07-05",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "pago_online",
    "totalPrice": 72,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_31",
    "professionalId": "prof_16",
    "client": {
      "id": "cli_19",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11991748859",
      "email": "vitoriacliente@email.com",
      "totalBookings": 15,
      "lastVisit": "2026-06-06T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_2g4ltq0",
        "professionalId": "prof_16",
        "name": "Pedras Quentes",
        "category": "massoterapia",
        "description": "Serviço de Pedras Quentes com produtos de alta qualidade.",
        "duration": 90,
        "price": 295,
        "images": [
          "https://picsum.photos/seed/3bhrq8y/400/400"
        ]
      }
    ],
    "date": "2026-06-27",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "cartao",
    "totalPrice": 295,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_32",
    "professionalId": "prof_20",
    "client": {
      "id": "cli_18",
      "name": "Quintina Cliente",
      "avatar": "https://i.pravatar.cc/150?u=QuintinaCliente",
      "phone": "11941385283",
      "email": "quintinacliente@email.com",
      "totalBookings": 17,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_op4r4sr",
        "professionalId": "prof_20",
        "name": "Tratamento de Unha Encravada",
        "category": "podologa",
        "description": "Serviço de Tratamento de Unha Encravada com produtos de alta qualidade.",
        "duration": 30,
        "price": 281,
        "images": [
          "https://picsum.photos/seed/qk4cuhl/400/400"
        ]
      }
    ],
    "date": "2026-06-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "cartao",
    "totalPrice": 281,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_33",
    "professionalId": "prof_16",
    "client": {
      "id": "cli_25",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11927572903",
      "email": "beatrizcliente@email.com",
      "totalBookings": 2,
      "lastVisit": "2026-06-07T01:32:58.046Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_7to1qsy",
        "professionalId": "prof_16",
        "name": "Massagem Relaxante",
        "category": "massoterapia",
        "description": "Serviço de Massagem Relaxante com produtos de alta qualidade.",
        "duration": 120,
        "price": 108,
        "images": [
          "https://picsum.photos/seed/zkwteh4/400/400"
        ]
      }
    ],
    "date": "2026-06-29",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "dinheiro",
    "totalPrice": 108,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_34",
    "professionalId": "prof_5",
    "client": {
      "id": "cli_13",
      "name": "Yasmin Cliente",
      "avatar": "https://i.pravatar.cc/150?u=YasminCliente",
      "phone": "11979197300",
      "email": "yasmincliente@email.com",
      "totalBookings": 4,
      "lastVisit": "2026-06-06T01:32:58.046Z",
      "tags": [
        "novo"
      ]
    },
    "services": [
      {
        "id": "srv_au7x5cm",
        "professionalId": "prof_5",
        "name": "Micropigmentação Labial",
        "category": "micropigmentacao",
        "description": "Serviço de Micropigmentação Labial com produtos de alta qualidade.",
        "duration": 110,
        "price": 72,
        "images": [
          "https://picsum.photos/seed/ioh4nz7/400/400"
        ]
      }
    ],
    "date": "2026-06-24",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "concluido",
    "paymentMethod": "pix",
    "totalPrice": 72,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_35",
    "professionalId": "prof_15",
    "client": {
      "id": "cli_15",
      "name": "Zelia Cliente",
      "avatar": "https://i.pravatar.cc/150?u=ZeliaCliente",
      "phone": "11918862148",
      "email": "zeliacliente@email.com",
      "totalBookings": 2,
      "lastVisit": "2026-06-27T01:32:58.046Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_z9v7knn",
        "professionalId": "prof_15",
        "name": "Esmaltação em Gel",
        "category": "manicure",
        "description": "Serviço de Esmaltação em Gel com produtos de alta qualidade.",
        "duration": 30,
        "price": 40,
        "images": [
          "https://picsum.photos/seed/t0svkzg/400/400"
        ]
      }
    ],
    "date": "2026-07-01",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "pix",
    "totalPrice": 40,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_36",
    "professionalId": "prof_4",
    "client": {
      "id": "cli_14",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11983469026",
      "email": "beatrizcliente@email.com",
      "totalBookings": 13,
      "lastVisit": "2026-06-04T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_4mhoaf8",
        "professionalId": "prof_4",
        "name": "Design de Sobrancelhas",
        "category": "sobrancelhas",
        "description": "Serviço de Design de Sobrancelhas com produtos de alta qualidade.",
        "duration": 80,
        "price": 250,
        "images": [
          "https://picsum.photos/seed/2izt9md/400/400"
        ]
      }
    ],
    "date": "2026-06-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "nao_compareceu",
    "paymentMethod": "pix",
    "totalPrice": 250,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_37",
    "professionalId": "prof_20",
    "client": {
      "id": "cli_20",
      "name": "Mariana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=MarianaCliente",
      "phone": "11926954085",
      "email": "marianacliente@email.com",
      "totalBookings": 3,
      "lastVisit": "2026-06-20T01:32:58.046Z",
      "tags": [
        "sensivel_atraso"
      ]
    },
    "services": [
      {
        "id": "srv_3kweenv",
        "professionalId": "prof_20",
        "name": "Manicure Clássica",
        "category": "manicure",
        "description": "Serviço de Manicure Clássica com produtos de alta qualidade.",
        "duration": 70,
        "price": 270,
        "images": [
          "https://picsum.photos/seed/zok2k8x/400/400"
        ]
      }
    ],
    "date": "2026-06-29",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pendente",
    "paymentMethod": "cartao",
    "totalPrice": 270,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_38",
    "professionalId": "prof_6",
    "client": {
      "id": "cli_1",
      "name": "Vitoria Cliente",
      "avatar": "https://i.pravatar.cc/150?u=VitoriaCliente",
      "phone": "11973343003",
      "email": "vitoriacliente@email.com",
      "totalBookings": 1,
      "lastVisit": "2026-06-22T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_preyn8f",
        "professionalId": "prof_6",
        "name": "Limpeza de Pele",
        "category": "esteticista",
        "description": "Serviço de Limpeza de Pele com produtos de alta qualidade.",
        "duration": 40,
        "price": 203,
        "images": [
          "https://picsum.photos/seed/q8np1b6/400/400"
        ]
      }
    ],
    "date": "2026-06-26",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "dinheiro",
    "totalPrice": 203,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_39",
    "professionalId": "prof_16",
    "client": {
      "id": "cli_3",
      "name": "Juliana Cliente",
      "avatar": "https://i.pravatar.cc/150?u=JulianaCliente",
      "phone": "11952352338",
      "email": "julianacliente@email.com",
      "totalBookings": 6,
      "lastVisit": "2026-06-24T01:32:58.045Z",
      "tags": [
        "vip"
      ]
    },
    "services": [
      {
        "id": "srv_qwt7hg2",
        "professionalId": "prof_16",
        "name": "Plástica dos Pés",
        "category": "pedicure",
        "description": "Serviço de Plástica dos Pés com produtos de alta qualidade.",
        "duration": 90,
        "price": 96,
        "images": [
          "https://picsum.photos/seed/31t08rz/400/400"
        ]
      }
    ],
    "date": "2026-07-08",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "confirmado",
    "paymentMethod": "pago_online",
    "totalPrice": 96,
    "createdAt": "2026-07-02T01:32:58.046Z"
  },
  {
    "id": "bkg_40",
    "professionalId": "prof_10",
    "client": {
      "id": "cli_14",
      "name": "Beatriz Cliente",
      "avatar": "https://i.pravatar.cc/150?u=BeatrizCliente",
      "phone": "11983469026",
      "email": "beatrizcliente@email.com",
      "totalBookings": 13,
      "lastVisit": "2026-06-04T01:32:58.046Z",
      "tags": []
    },
    "services": [
      {
        "id": "srv_6h2dm3w",
        "professionalId": "prof_10",
        "name": "Massagem Relaxante",
        "category": "massoterapia",
        "description": "Serviço de Massagem Relaxante com produtos de alta qualidade.",
        "duration": 50,
        "price": 194,
        "images": [
          "https://picsum.photos/seed/lnbv0v7/400/400"
        ]
      }
    ],
    "date": "2026-06-24",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "cancelado",
    "paymentMethod": "pago_online",
    "totalPrice": 194,
    "createdAt": "2026-07-02T01:32:58.046Z"
  }
];
