const Prom = require('bluebird');
const request = Prom.promisifyAll(require('request'), { suffix: 'Prom' });
let baseUri;

if (typeof window == 'undefined') {
  // For testing purposes only
  baseUri = 'http://localhost:3000/api';
} else {
  baseUri = `http://${window.location.hostname}:3000/api`;
}

/* USER REGISTRATION */
module.exports.register = data => {
  const formData = {
    form: {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };

  return request.postProm(baseUri + '/user', formData)
  .then(data => JSON.parse(data.body));
};

/* USER LOGIN */
module.exports.login = data => {
  const formData = {
    form: {
      username: data.username,
      password: data.password,
    },
  };

  return request.postProm(baseUri + '/user/auth', formData)
  .then(data => JSON.parse(data.body));
};

/* USER PASSWORD CHANGE */
module.exports.changePassword = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    },
  };

  return request.patchProm(baseUri + '/user/auth', formData)
  .then(data => JSON.parse(data.body));
};

/* USER SEARCH */
module.exports.search = string => request.getProm(baseUri + '/user/search/' + string)
.then(data => JSON.parse(data.body));

/* GET USER */
module.exports.getUser = username => request.getProm(baseUri + '/user/' + username)
.then(data => JSON.parse(data.body));

/* GET FEED */
module.exports.getFeed = data => {
  let url = baseUri + '/slot/' + '?accessToken=' + data.accessToken;

  if (data.start !== undefined && data.finish !== undefined) {
    url += `&start=${data.start}&finish=${data.finish}`;
  }

  return request.getProm(url)
  .then(data => JSON.parse(data.body));
};

/* GET USER AUTHENTICATED */
module.exports.getUserAuthenticated = data => request.getProm(`${baseUri}/user/${(data.username || '')}?accessToken=${data.accessToken}`)
.then(data => JSON.parse(data.body));

/* ADD USER */
module.exports.addUser = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
    },
  };

  return request.postProm(baseUri + '/user/' + data.username, formData)
  .then(data => JSON.parse(data.body));
};

/* CREATE SLOT */
module.exports.createSlot = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      start: data.start,
      finish: data.finish,
    },
  };

  return request.postProm(baseUri + '/slot/', formData)
  .then(data => JSON.parse(data.body));
};

/* RESPOND TO SLOT */
module.exports.respondSlot = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      slotId: data.slotId,
    },
  };

  return request.postProm(baseUri + '/slot/respond', formData)
  .then(data => JSON.parse(data.body));
};

/* CONFIRM SLOT MEETING */
module.exports.confirmMeeting = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      username: data.username,
      slotId: data.slotId,
    },
  };

  return request.postProm(baseUri + '/slot/confirm', formData)
  .then(data => JSON.parse(data.body));
};

/* DECLINE SLOT MEETING */
module.exports.declineMeeting = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      username: data.username,
      slotId: data.slotId,
    },
  };

  return request.postProm(baseUri + '/slot/decline', formData)
  .then(data => JSON.parse(data.body));
};

/* CHANGE USER IMAGE */
module.exports.changeImage = data => {
  const formData = {
    form: {
      accessToken: data.accessToken,
      image: data.image,
    },
  };

  return request.postProm(baseUri + '/user/image', formData)
  .then(data => JSON.parse(data.body));
};
