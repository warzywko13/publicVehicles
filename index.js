/*
    Autor: Warzywko
*/

const { location, vehModel, locSettings } = require("./settings.js");
let shape = [],
  marker = [],
  vehicle = [],
  blip = [],
  myTimeout;

const newVehicle = (x, y, z) => {
  const table = mp.vehicles.toArray();
  const i = table.length;

  vehicle[i] = mp.vehicles.new(vehModel.model, new mp.Vector3(x, y, z), {
    numberPlate: vehModel.plate,
  });
  vehicle[i].setVariable("public", true);
  vehicle[i].setVariable("leftVehicle", false);
};

for (let i = 0; i < location.length; i++) {
  let x = location[i].x,
    y = location[i].y,
    z = location[i].z;

  shape[i] = mp.colshapes.newSphere(x, y, z, 1.5 * 0.9);
  shape[i].setVariable("publicVehicle", true);

  marker[i] = mp.markers.new(
    locSettings.marker,
    new mp.Vector3(x, y, z + 2),
    1,
    {
      direction: new mp.Vector3(0, 0, 0),
      rotation: new mp.Vector3(0, 0, 0),
      color: [46, 204, 113, 255],
      visible: true,
      dimension: 0,
    }
  );

  newVehicle(x, y, z);

  blip[i] = mp.blips.new(locSettings.blip, new mp.Vector3(x, y, z), {
    name: "Pojazd publiczny",
    color: 2,
    shortRange: true,
  });
}

const removeVehicle = (veh) => {
  if (!veh) {
    return;
  }

  console.log(`Pojazd ${veh.id} został usunięty!`);
  veh.destroy();
};

const playerExitVehicle = (player, vehicle2) => {
  if (!player.vehicle) {
    return;
  }
  if (!vehicle2.getVariable("public")) {
    return;
  }

  console.log(`Za ${vehModel.destroyTime / 1000} sekund pojazd zniknie`);
  vehicle2.setVariable("leftVehicle", true);
  myTimeout = setTimeout(() => {
    removeVehicle(vehicle2);
  }, vehModel.destroyTime);
};

mp.events.add({
  playerExitVehicle: (player, vehicle2) => playerExitVehicle(player, vehicle2),

  playerQuit: (player, exitType, reason) =>
    playerExitVehicle(player, player.vehicle),

  playerExitColshape: (player, shape2) => {
    if (!player.vehicle) {
      return;
    }
    if (
      !shape[shape2.id].getVariable("publicVehicle") ||
      !player.vehicle.getVariable("public")
    ) {
      return;
    }

    setTimeout(() => {
      const x = location[shape2.id].x,
        y = location[shape2.id].y,
        z = location[shape2.id].z;
      newVehicle(x, y, z);
    }, vehModel.respawnTime);
  },

  playerEnterVehicle: (player, vehicle2) => {
    if (!vehicle2.getVariable("public")) {
      return;
    }
    if (!vehicle2.getVariable("leftVehicle")) {
      return;
    }
    clearTimeout(myTimeout);
  },
});
