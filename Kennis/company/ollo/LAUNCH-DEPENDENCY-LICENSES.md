# Ollo launch dependency license evidence

Date: 2026-10-18. This note supplements `docs/evidence/2026-10-18-launch-preparation/dependency-license-audit.json`; the parent has now updated that audit and app notices from the validated primary records. All 17 previously unresolved new coordinates now have official Google Maven POM evidence: 12 declare Apache 2.0 and 5 declare the Android Software Development Kit License. POM hashes and copies are recorded in `C:\Temp\ollo-build\license-followup-2026-10-18\license-followup.json`.

## Verified Apache 2.0 declarations

The official Google Maven POMs below declare “The Apache Software License, Version 2.0” and link to `http://www.apache.org/licenses/LICENSE-2.0.txt`:

- `androidx.appcompat:appcompat-resources 1.6.1` — https://dl.google.com/dl/android/maven2/androidx/appcompat/appcompat-resources/1.6.1/appcompat-resources-1.6.1.pom (SHA-256 d9fd339b2b637051ba5934c8d87c7b9c7d368d47b5fa847d6c269da2852cfc63)
- `androidx.customview:customview 1.0.0` — https://dl.google.com/dl/android/maven2/androidx/customview/customview/1.0.0/customview-1.0.0.pom (SHA-256 ce9e47b87184f5bd5e139e9becd5b26476d42d78c31bf2fdedc37acb41b9ad49)
- `androidx.loader:loader 1.0.0` — https://dl.google.com/dl/android/maven2/androidx/loader/loader/1.0.0/loader-1.0.0.pom (SHA-256 c978d550808b47434aa49a63164110a50b55b0bcc6160a93a2e37d5110df8c5e)
- `androidx.vectordrawable:vectordrawable 1.1.0` — https://dl.google.com/dl/android/maven2/androidx/vectordrawable/vectordrawable/1.1.0/vectordrawable-1.1.0.pom (SHA-256 5b0e2d5b2179e54804785cbc21ce5f473b5e1ddd55a57da482e94dcd39492bb2)
- `androidx.vectordrawable:vectordrawable-animated 1.1.0` — https://dl.google.com/dl/android/maven2/androidx/vectordrawable/vectordrawable-animated/1.1.0/vectordrawable-animated-1.1.0.pom (SHA-256 276a20116b705fb75b9003ee9496c56f6fd3b32375fb232472811eba60a040bd)
- `androidx.viewpager:viewpager 1.0.0` — https://dl.google.com/dl/android/maven2/androidx/viewpager/viewpager/1.0.0/viewpager-1.0.0.pom (SHA-256 1f72f836339d03c6eb013f65075e76ca87075a577578eb4f95f74a3a5d253128)
- `com.google.android.datatransport:transport-api 3.0.0` — https://dl.google.com/dl/android/maven2/com/google/android/datatransport/transport-api/3.0.0/transport-api-3.0.0.pom (SHA-256 1537bebd44da2eb7e3be73fc4259e1116f2a68a5305f4fe23c6cea9a6f84f791)
- `com.google.android.datatransport:transport-backend-cct 3.1.8` — https://dl.google.com/dl/android/maven2/com/google/android/datatransport/transport-backend-cct/3.1.8/transport-backend-cct-3.1.8.pom (SHA-256 42698696ebd5af1eb33f917e582baa416e289a21cd83ee329c255852216b8a78)
- `com.google.android.datatransport:transport-runtime 3.1.8` — https://dl.google.com/dl/android/maven2/com/google/android/datatransport/transport-runtime/3.1.8/transport-runtime-3.1.8.pom (SHA-256 d6ff762251fb35594afe5efe860b5871064e18c0bd1bdb77084e3573f90e4e8f)
- `com.google.firebase:firebase-encoders 17.0.0` — https://dl.google.com/dl/android/maven2/com/google/firebase/firebase-encoders/17.0.0/firebase-encoders-17.0.0.pom (SHA-256 423575e3500e9910e3aa83f9d7a6d755b5f76ac591823baf67570fb6ce7ea816)
- `com.google.firebase:firebase-encoders-json 18.0.0` — https://dl.google.com/dl/android/maven2/com/google/firebase/firebase-encoders-json/18.0.0/firebase-encoders-json-18.0.0.pom (SHA-256 3a7d59795a799683afa6435931066c5bb634adfebd2883a08b4765f38cdd3ea1)
- `com.google.firebase:firebase-encoders-proto 16.0.0` — https://dl.google.com/dl/android/maven2/com/google/firebase/firebase-encoders-proto/16.0.0/firebase-encoders-proto-16.0.0.pom (SHA-256 5f5fb74af3fff0e1f961fcb5f3f99267c103b16a23c89b556c8cb4a711a8dcb2)

This establishes the license declared in primary artifact metadata. Before changing the shipped notice inventory, compare existing notice coverage and include Apache 2.0 text and attribution required by that license.

## Google Play services: declared SDK terms; open review

These five primary POMs declare “Android Software Development Kit License” and link to the Android SDK terms page:

- `com.google.android.gms:play-services-base 18.5.0` — https://dl.google.com/dl/android/maven2/com/google/android/gms/play-services-base/18.5.0/play-services-base-18.5.0.pom (SHA-256 2570b515c2717af386c890e97f644782e3f86da7b677a4ff1036147e7ea622a4)
- `com.google.android.gms:play-services-basement 18.9.0` — https://dl.google.com/dl/android/maven2/com/google/android/gms/play-services-basement/18.9.0/play-services-basement-18.9.0.pom (SHA-256 601ef047167c6c280b8b190942d9e94a0463e891acd9c6ccf532eb298a5efe5b)
- `com.google.android.gms:play-services-location 19.0.0` — https://dl.google.com/dl/android/maven2/com/google/android/gms/play-services-location/19.0.0/play-services-location-19.0.0.pom (SHA-256 cce60a0c4250e5be6d33f46505ba7269048a68d478862c87bf761c69ef84da3e)
- `com.google.android.gms:play-services-places-placereport 17.0.0` — https://dl.google.com/dl/android/maven2/com/google/android/gms/play-services-places-placereport/17.0.0/play-services-places-placereport-17.0.0.pom (SHA-256 23604d3a278bd430af4f204105e48492f71501516201d8a2a8e72253fb9396f7)
- `com.google.android.gms:play-services-tasks 18.2.0` — https://dl.google.com/dl/android/maven2/com/google/android/gms/play-services-tasks/18.2.0/play-services-tasks-18.2.0.pom (SHA-256 6b99c48a895d155e58abcee66cc22146db83abd5d84caf6c8f7a2aea9b1bcd21)

Terms source: https://developer.android.com/studio/terms.html; captured copy SHA-256 
9d21b317342ae7c1f58c1025e282720da6cec3281831b762861b4d16864c8d60
. Keep these five marked unresolved for open-source-license classification and launch notice decisions. Artifact metadata points to SDK terms; it does not establish an Apache/MIT classification. A reviewer must determine from the referenced terms and distribution context whether attribution or redistribution conditions apply. Do not relabel these as Apache 2.0 or remove the review flag based on inference.

## Proposed audit / notice patch for parent integration

1. In the audit, replace the 17 `unresolved-primary-license-source` statuses with per-coordinate declared metadata: Apache 2.0 for the 12 entries above, and `Android Software Development Kit License; terms review open` for the five Play services entries. Add POM source URLs and hashes from the companion JSON.
2. Update the unresolved count to 5 (terms interpretation and release notice decision), not zero. The evidence gap for primary POM retrieval is closed; the policy interpretation is not.
3. Keep the shipped library inventory labels consistent with the eventual legal review. Add Apache notice text where required. Do not claim the Play services artifacts are open source or invent attribution terms.
4. Re-check current notice contents against Apache License 2.0 requirements before release; this evidence pass did not edit tracked JSON, assets, or app code.

Research was limited to primary Google Maven artifact POMs and the official Android SDK terms page. No Gradle build, emulator, or app source/config changes were made.

Parent verification18October: independently parsed and SHA-256 checked all17POMs, confirmed12Apache/5SDK declarations, copied primary POMs into the app evidence folder and updated the existing audit/notices. Runtime inventory unchanged. These notice changes are included in the rebuilt UI confirmation APK0e5e43f01e5635b9fb233d257c120d5635c06a369072f1b76a79456d835c19df; native confirmation passed; local commit still pending.
