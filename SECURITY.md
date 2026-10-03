# Reporting a security issue

Never include a real Google Calendar private URL, password, signing token or personal event content in a public issue or pull request. Private iCal URLs grant access to calendar contents; if one leaks, reset it in Google Calendar.

This repository is currently local. Report suspected security issues directly to the maintainer using a private channel you already share. If it is published on GitHub later and private vulnerability reporting is enabled, use that feature. Do not post exploit details publicly before the maintainer has had a chance to investigate.

Include the affected version, browser version, reproduction steps using synthetic data, expected behavior and likely impact. No response-time commitment is made here.

Store credentials are not required for development. Local notes, tasks and uploaded media must remain local. Optional calendar requests must remain restricted to calendar.google.com and parse responses as data, not executable code.
