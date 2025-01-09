namespace EXE201_2RE_API.Repository
{
    public class GenericBackendService
    {
        private readonly IServiceProvider _serviceProvider;
        public GenericBackendService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public T? Resolve<T>()
        {
            return (T)_serviceProvider.GetService(typeof(T))!;
        }
    }
}
