const location = [
    {
        "x": -12.79,
        "y": 11.25,
        "z": 70.38
    },
    {
        "x": -1.03,
        "y": 7.11,
        "z": 69.89
    }
]

const locationSettings = {
    blip: 226,
    marker: 38
}

const vehModel = {
    model: "faggio",
    plate: "PUBLIC",
    destroyTime: 30000,
    respawnTime: 5000
} 

module.exports = {
    location: location,
    vehModel: vehModel,
    locSettings: locationSettings
}