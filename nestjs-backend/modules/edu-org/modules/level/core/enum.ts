export const eduLevels = [{
    "_id": {
        "$oid": "609bccaf4789a94a76ae5a8d"
    },
    "id": 1,
    "name": "специалисты",
    "name_vi_many": "студентов",
    "name_ak": "специалитет",
    "fisid": 5,
    "__v": 0,
    "epgu_id": 3,
    "sort": 5
}, {
    "_id": {
        "$oid": "609bccaf4789a94a76ae5a8e"
    },
    "id": 2,
    "name": "бакалавры",
    "name_vi_many": "студентов",
    "name_ak": "бакалавриат",
    "fisid": 2,
    "__v": 0,
    "epgu_id": 2,
    "sort": 4
}, {
    "_id": {
        "$oid": "609bccaf4789a94a76ae5a8f"
    },
    "id": 3,
    "name": "магистры",
    "name_vi_many": "магистрантов",
    "name_ak": "магистратура",
    "fisid": 4,
    "__v": 0,
    "epgu_id": 4,
    "sort": 6
}, {
    "_id": {
        "$oid": "609bccaf4789a94a76ae5a90"
    },
    "id": 4,
    "name": "СПО",
    "name_vi_many": "студентов",
    "name_ak": "Среднее профессиональное образование",
    "fisid": 17,
    "__v": 0,
    "epgu_id": 1,
    "sort": 3
}, {
    "_id": {
        "$oid": "609bccaf4789a94a76ae5a91"
    },
    "id": 5,
    "name": "аспирантура",
    "name_vi_many": "аспирантов",
    "name_ak": "аспирантура",
    "fisid": 18,
    "__v": 0,
    "epgu_id": 5,
    "sort": 7
}, {
    "_id": {
        "$oid": "64995870bd6b62791f403985"
    },
    "id": 7,
    "name": "Среднее (полное) общее образование (11 классов)",
    "name_vi_many": "Среднее (полное) общее образование (11 классов)",
    "name_ak": "Среднее (полное) общее образование (11 классов)",
    "fisid": 18,
    "__v": 0,
    "epgu_id": 50,
    "sort": 1
}, {
    "_id": {
        "$oid": "649958a0bd6b62791f403986"
    },
    "id": 8,
    "name": "Основное общее образование (9 классов)",
    "name_vi_many": "Основное общее образование (9 классов)",
    "name_ak": "Основное общее образование (9 классов)",
    "fisid": 18,
    "__v": 0,
    "epgu_id": 50,
    "sort": 2
}]

export const eduLevelsById = eduLevels.reduce((map, item) => {
    map[item.id] = item
    return map
},{})
