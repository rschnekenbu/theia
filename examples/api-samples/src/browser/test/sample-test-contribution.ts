/* eslint-disable @typescript-eslint/no-explicit-any */
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { TestContribution, TestService } from '@theia/test/lib/browser/test-service';
import { TestControllerImpl } from '@theia/test/lib/browser/test-controller';
import { CommandContribution, CommandRegistry } from '@theia/core';
import { injectable, interfaces } from '@theia/core/shared/inversify';

const testController = new TestControllerImpl('SampleTestController', 'Sample Test Controller');
testController.onItemsChanged(e => {
    console.log(JSON.stringify(e, undefined, 4));
});

@injectable()
export class SampleTestContribution implements TestContribution, CommandContribution {

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand({ id: 'testController.addSomeTests', label: 'Add Some Tests', category: 'Tests Sample' }, {
            execute(...args: any): any {

            }
        });

        commands.registerCommand({ id: 'testController.dumpController', label: 'Dump Controller Contents', category: 'Tests Sample' }, {
            execute(...args: any): any {
                console.log(JSON.stringify(testController, undefined, 4));
            }
        });

    }

    registerTestControllers(service: TestService): void {
        service.registerTestController(testController);
    }
}

export function bindTestSample(bind: interfaces.Bind): void {
    bind(SampleTestContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(SampleTestContribution);
    bind(TestContribution).toService(SampleTestContribution);
};

