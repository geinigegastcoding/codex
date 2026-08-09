# Script

**Hook:** An AI tool can run locally and still send data to the cloud. Local is a location; privacy is a data-flow decision.

**UI:** Ask where the model runs, where files are stored and whether telemetry leaves the device.

**Diagram:** Input enters the app, the app chooses a model endpoint, and logs/files/prompts may be retained elsewhere.

**Code:** Make endpoint and logging choices explicit. A local URL is evidence, not proof that every other service is disabled.

**Comparison:** Fully local and hybrid workflows can both be valid, but they have different boundaries.

**Conclusion:** Check endpoint, storage and telemetry for every tool.
