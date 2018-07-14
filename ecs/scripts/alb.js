require('dotenv').config();
const AWS = require('aws-sdk');

// globals

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_USERNAME = process.env.AWS_USERNAME;
const AWS_CONFIG_REGION = 'us-west-2';
const SHORT_GIT_HASH = process.env.CIRCLE_SHA1.substring(0, 7);
const VPC_ID = process.env.MICROSERVICE_VPC_ID;
const DEFAULT_TARGET_GROUP_ARN = process.env.DEFAULT_TARGET_GROUP_ARN;
const LOAD_BALANCER_ARN = process.env.LOAD_BALANCER_ARN;

let USERS_TARGET_GROUP_ARN;
let MOVIES_TARGET_GROUP_ARN;
let WEB_TARGET_GROUP_ARN;

// config

AWS.config = new AWS.Config();
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
AWS.config.region = AWS_CONFIG_REGION;

// init aws services

const elbv2 = new AWS.ELBv2();
const iam = new AWS.IAM();

// methods

function ensureAuthenticated() {
  return new Promise((resolve, reject) => {
    const params = { UserName: AWS_USERNAME };
    iam.getUser(params, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}

function addTargetGroup(service, port, path) {
  return new Promise((resolve, reject) => {
    var params = {
      Name: `${SHORT_GIT_HASH}-${service}`,
      Port: port,
      Protocol: 'HTTP',
      VpcId: VPC_ID,
      HealthCheckPath: path
    };
    elbv2.createTargetGroup(params, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}

function addListener(port) {
 return new Promise((resolve, reject) => {
   var params = {
     DefaultActions: [
       {
         TargetGroupArn: DEFAULT_TARGET_GROUP_ARN,
         Type: 'forward'
       }
     ],
     LoadBalancerArn: LOAD_BALANCER_ARN,
     Port: port,
     Protocol: 'HTTP'
   };
 }); 
}

// main

return ensureAuthenticated()
.then((data) => {
  console.log(`Welcome ${data.User.UserName}`);
  return addTargetGroup('users', '3000', '/users/ping');
})
.then((res) => {
  USERS_TARGET_GROUP_ARN = res.TargetGroups[0].TargetGroupArn;
  console.log('Target Group Added!');
  return addTargetGroup('movies', '3000', '/movies/ping');
})
.then((res) => {
  MOVIES_TARGET_GROUP_ARN = res.TargetGroups[0].TargetGroupArn;
  console.log('Target Group Added!');
  return addTargetGroup('web', '9000', '/');
})
.then((res) => {
  WEB_TARGET_GROUP_ARN = res.TargetGroups[0].TargetGroupArn;
  console.log('Target Group Added!');
})
.catch((err) => { console.error(err); });
