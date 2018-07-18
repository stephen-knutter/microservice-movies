function createMoviesService(cluster, name, targetGroupArn) {
  const params = {
    cluster: cluster,
    serviceName: name,
    taskDefinition: 'microservicemovies-review-movies-td',
    loadBalancers: [
      {
        targetGroupArn: targetGroupArn,
        containerName: 'movies-service-review',
        containerPort: 3000
      }
    ],
    desiredCount: 1,
    role: 'ecsServiceRole'
  };
  return params;
}

module.exports = {
  createMoviesService
};
