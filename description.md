We can add **throttle** to the Camel twitter request, in order not to burn the API and avoid, for instance, DDOS attacks.
Or just not to be banned.

It can be implemented by adding:
- `throttle` option, adding a `MAXIMUM_REQUESTS` parameter to set the maximum requests within the *timePeriodMillis* we established (or default). We are using **1** to make a clearer view.
- `timePeriodMillis` option, adding a `REQUEST_COOLING_TIME_MILLIS` parameter to set our default *timePeriodMillis* (default is 1000). We are using **5000**.
- `rejectExecution` option, setting it to **true**, in order to send a `500` status code to let the client know that something is failing. Otherwise, the requests are queued. When the cooling time has expired, a queued request is sent and dequeued.

```kotlin
const val MAXIMUM_REQUESTS = 1L
const val REQUEST_COOLING_TIME_MILLIS = 5000L
    
from(DIRECT_ROUTE)
            .throttle(MAXIMUM_REQUESTS)
            .timePeriodMillis(REQUEST_COOLING_TIME_MILLIS)
            .rejectExecution(true)
            .toD("twitter-search:\${header.q}?count=\${header.max}")
            .wireTap(LOG_ROUTE)
            .wireTap(COUNT_ROUTE)
```
In order to see the error when camel sends the exception, we can catch it in the `fail` function of the ajax get request.

```javascript
.fail((err) => {
            errorNotification(handleErr(err.status))
        });
```

Then, we can see it running as we expected.

![camel](https://user-images.githubusercontent.com/49093831/145462579-ee76c185-128d-4a11-9892-d5334bd6d07c.gif)

More info: [Apache Camel - Throttle](https://camel.apache.org/components/3.13.x/eips/throttle-eip.html)
