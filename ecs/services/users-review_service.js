function createUsersService(cluster, name, targetGroupArn) {
  const params = {
    cluster: cluster,
    serviceName: name,
    taskDefinition: 'microservicemovies-review-users-td',
    loadBalancers: [
      {
        targetGroupArn: targetGroupArn,
        containerName: 'users-service-review',
        containerPort: 3000
      }
    ],
    desiredCount: 1,
    role: 'ecsServiceRole'
  };
  return params;
}

module.exports = {
  createUsersService
};
