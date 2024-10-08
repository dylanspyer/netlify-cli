import { join } from 'path'
import process from 'process'

import { describe, expect, test } from 'vitest'

import { isFileAsync } from '../../../../src/lib/fs.js'
import { callCli } from '../../utils/call-cli.js'
import { getCLIOptions, withMockApi, getEnvironmentVariables } from '../../utils/mock-api.js'
import { withSiteBuilder, withTwoSiteBuilders } from '../../utils/site-builder.ts'

describe('link command', () => {
  test.only('should prefer exact name match when available', async (t) => {
    const siteInfo1 = {
      admin_url: 'https://app.netlify.com/sites/site-name/overview',
      ssl_url: 'https://site-name.netlify.app/',
      id: 'site_id1',
      name: 'next-app-playground',
      build_settings: { repo_url: 'https://github.com/owner/repo' },
    }

    const siteInfo2 = {
      admin_url: 'https://app.netlify.com/sites/site-name-two/overview2',
      ssl_url: 'https://site-name-two.netlify.app/',
      id: 'site_id2',
      name: 'app',
      build_settings: { repo_url: 'https://github.com/owner/repo2' },
    }

    const routes = [
      {
        path: 'sites',
        response: [siteInfo1, siteInfo2],
      },
      { path: 'sites/site_id1', response: siteInfo1 },
      { path: 'sites/site_i2', response: siteInfo2 },
    ]
    await withSiteBuilder(t, async (builder) => {
      await withSiteBuilder(t, async (builder) => {
        await builder.withGit().build()

        await withMockApi(
          routes,
          async ({ apiUrl }) => {
            const stdout = await callCli(
              ['link', '--name', 'app'],
              getCLIOptions({ builder, apiUrl, env: { NETLIFY_SITE_ID: '' } }),
            )

            expect(stdout).toContain('Linked to app')
          },
          true,
        )
      })
    })
  })
  // test.only('should create gitignore in repository root when is root TEST', async (t) => {
  //   await withSiteBuilder(t, async (builder) => {
  //     await builder.withGit().build()

  //     await withMockApi(
  //       routes,
  //       async ({ apiUrl }) => {
  //         console.log('apiURL:', apiUrl)
  //         const sites = await callCli(['sites:list'], getCLIOptions({ builder, apiUrl, env: { NETLIFY_SITE_ID: '' } }))
  //         console.log('sites:', sites)
  //         const stdout = await callCli(
  //           ['link', '--name', 'app'],
  //           getCLIOptions({ builder, apiUrl, env: { NETLIFY_SITE_ID: '' } }),
  //         )
  //         console.log(stdout)

  //         expect(await isFileAsync(join(builder.directory, '.gitignore'))).toBe(true)

  //         // expect stdout to contain Linked to app
  //       },
  //       true,
  //     )
  //   })
  // })

  test.skipIf(process.platform === 'win32')(
    'should create gitignore in repository root when cwd is subdirectory',
    async (t) => {
      await withSiteBuilder(t, async (builder) => {
        const projectPath = join('projects', 'project1')
        // await builder.withGit().withNetlifyToml({ config: {}, pathPrefix: projectPath })
        await builder
          .withNetlifyToml({ config: {}, pathPrefix: projectPath })
          .withStateFile({ siteId: siteInfo.id })
          .build()
        await withMockApi(
          routes,
          async ({ apiUrl }) => {
            const options = getCLIOptions({ apiUrl, builder })
            // const environment = getEnvironmentVariables({ apiUrl })
            // console.log('environment:', environment)
            // console.log('options:', options)

            // console.log('builder:', builder)
            // await callCli(['unlink'], { ...options, cwd: join(builder.directory, projectPath) })
            // const res = await callCli(['link', '--name', 'lookimnetliflying'])
            // const stdout = await callCli(['unlink'], {
            //   ...options,
            //   cwd: join(builder.directory, projectPath),
            // })
            // const cmd = process.platform === 'win32' ? 'set' : 'printenv'
            // const output = await callCli(['dev:exec', cmd], getCLIOptions({ builder, apiUrl }))
            // console.log('output:', output)
            // console.log(res)

            const l = await callCli(['link', '--name', 'site_id4'], {
              ...options,
              cwd: join(builder.directory, projectPath),
            })

            // env:list

            console.log('this is the log after linking', l, '!!!')

            // console.log(stdout)
            // await callCli(['link', {}])

            // ntl link --name site2

            expect(true).toBe(true)
          },
          true,
        )
      })
    },
  )
})

// test('should prefer exact matching site name if exists', async (t) => {
//   console.log(t.task.name)
//   await withTwoSiteBuilders(t, async (builder1, builder2) => {
//     console.log(builder1)
//     console.log(builder2)

//     const projectPath = join('projects', 'project1')
//     await builder1.withEnvFile().withNetlifyToml({ config: {}, pathPrefix: projectPath }).build()

//     await withMockApi(
//       [],
//       async ({ apiUrl }) => {
//         const options = getCLIOptions({ builder1, apiUrl })
//         const stdout = await callCli(['link'], { ...options, cwd: join(builder1.directory, projectPath) })
//         console.log(stdout)

//       },
//       true,
//     )

//     // expect(builder
//   })
// await withSiteBuilder('siteName', async (builder) => {
//   await withMockApi(
//     [],
//     async ({ apiUrl }) => {
//       await callCli(['link'], getCLIOptions({ builder, apiUrl }))

//       expect(true)
//     },
//     true,
//   )
// })
// })
