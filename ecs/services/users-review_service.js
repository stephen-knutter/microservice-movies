function createUsersService(cluster, name, targetGroup) {
  const params = {
    cluster: cluster,
    serviceName: name,
    taskDefinition: 'microservicemovies-review-users-td',
    loadBalancers: [
      {
        loadBalancerName: 'microservicemovies-review',
        containerName: 'users-service-review',
        containerPort: 3000
      }
    ],
    desiredCount: 1,
    role: ''
  };
  return params;
}

module.exports = {
  createUsersService
};
