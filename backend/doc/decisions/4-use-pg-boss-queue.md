Decided to use [pg-boss](https://github.com/timgit/pg-boss) queue for managing [background task processing](
3-background-task-processing.md) because:
 - It uses Postgres for persistence which is used in the backend system anyway (for storing the scraping results), thus
 reducing the operational variability of the backend, compared to if a separate persistent queue such as RabbitMQ was
 used.
 - pg-boss is chosen over [graphile-worker](https://github.com/graphile/worker) because it supports multiple queues
 (at least I couldn't figure out how to create multiple different queues from the docs of graphile-worker, as of the
 version 0.4.0). We will need multiple queues for managing processing with different priorities, e. g. periodic batch
 scraping vs. first-time scraping for orgs just added to the website.

See [this message](https://github.com/climatescape/climatescape.org/issues/40#issuecomment-585112177).

