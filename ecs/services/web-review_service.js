function createWebService(cluster, name, targetGroup) {
  const params = {
    cluster: cluster,
    serviceName: name,
    taskDefinition: 'microservicemovies-review-web-td',
    loadBalancers: [
      {
        targetGroupArn: targetGroup,
        loadBalancerName: 'microservicemovies-review',
        containerName: 'web-service-review',
        containerPort: 9000
      }
    ],
    desiredCount: 1,
    role: ''
  };
  return params;
}

module.exports = {
  createWebService
};
