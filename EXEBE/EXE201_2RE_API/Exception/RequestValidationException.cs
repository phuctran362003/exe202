using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Exceptions
{
    public class RequestValidationException : Exception
    {
        public ValidationProblemDetails ProblemDetails { get; set; }
        public RequestValidationException(ValidationProblemDetails details)
        {
            ProblemDetails = details;
        }
    }
}
